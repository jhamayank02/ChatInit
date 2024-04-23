import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Avatar from '../../ui/Avatar';
import { SocketContext } from '../../socket';
import { CHAT_JOINED, CHAT_LEFT, NEW_ATTACHMENT, NEW_MESSAGE, REFETCH_MESSAGES, START_TYPING, STOP_TYPING } from '../../constants/events';
import { useSelector } from 'react-redux';
import { useGetMessagesMutation, useSendAttachmentMutation } from '../../redux/api/api';
import { toast } from 'react-toastify';
import { removeNewMessagesAlert } from '../../redux/reducers/notification';
import { useDispatch } from 'react-redux';
import MessageSkeleton from '../../ui/skeletons/MessageSkeleton';
import moment from 'moment';
import { openAddMembersModal, openGroupDetailsModal, openUserDetailsModal } from '../../redux/reducers/misc';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../../utils/Loading';
import ClickMenu from '../../utils/ClickMenu';
import MessageCard from '../../ui/MessageCard';
import RealtimeMessageCard from '../../ui/RealtimeMessageCard';
import TypingAnimation from '../../utils/TypingAnimation';

const ChatArea = ({ currentChat, setCurrentChat }) => {

  const socket = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAttachment, setIsAttachment] = useState({
    selected: false,
    fileName: null,
    file: null
  });
  const user = useSelector(state => state.auth.user);
  const newMessagesAlert = useSelector(state => state.notification.newMessagesAlert);
  const dispatch = useDispatch();

  const [showAttachmentsMenu, setShowAttachmentsMenu] = useState(false);
  const closeAttachmentsMenuHandler = () => {
    setShowAttachmentsMenu(false);
  }

  const [getMessages, { isLoading: messagesLoading }] = useGetMessagesMutation();
  const [sendAttachment] = useSendAttachmentMutation();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [oldMessages, setOldMessages] = useState([]);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const [sendingAttachment, setSendingAttachment] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [refetchMessages, setRefetchMessages] = useState(false);

  const loadMore = async () => {
    if (hasMoreItems) {
      await getOldMessagesHandler(page + 1);
      setPage(page + 1);
    }
  }

  const chatId = currentChat.id;
  const participants = [...currentChat.participants, { _id: user.id }];

  const sendMsgHandler = () => {
    if (!message.trim()) {
      return;
    }

    // Emitting message to the server
    socket.emit(NEW_MESSAGE, { chatId, participants, message });
    setMessage("");
  }

  const sendAttachmentHandler = async () => {
    // console.log("sending")
    if (!isAttachment.selected) {
      return;
    }

    try {
      setSendingAttachment(true);
      const formData = new FormData();
      formData.append("msg", message);
      formData.append("attachment", isAttachment.file);
      formData.append("chat_id", chatId);
      formData.append("user_id", user.id);

      const response = await sendAttachment(formData);

      setSendingAttachment(false);
      if (response.error !== undefined) {
        throw Error(response.error.data.msg);
      }
      // console.log(response.data)

      const attachment_url = response.data.attachment_url;
      const attachment_mimetype = response.data.attachment_mimetype;
      toast.success(`Success: ${response.data.msg}`);
      setIsAttachment({selected: false, fileName: null, file: null});
      setMessage("");
      // Emitting message to the server
      socket.emit(NEW_ATTACHMENT, { chatId, participants, message, attachment_url, attachment_mimetype });
    }
    catch (err) {
      setSendingAttachment(false);
      toast.error(`Error: ${err.message}`);
    }
  }

  const messageOnchangeHandler = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { participants, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { participants, chatId });
      setIamTyping(false);
    }, 2000);
  }

  const getOldMessagesHandler = async (page) => {
    try {
      const response = await getMessages({ chat_id: chatId, page: page });

      if (page === response.data.totalPages || response.data.totalPages === 0) {
        setHasMoreItems(false);
      }

      if (response.error !== undefined) {
        throw Error(response.error.data.msg);
      }

      setOldMessages(prev => [...prev, ...response.data.messages]);
    }
    catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  }

  const handleAttachmentOpen = (e) => {
    // console.log("Handling attachment...", e.target.files[0])
    if (e.target.files.length > 0) {
      setIsAttachment({selected: true, fileName: e.target.files[0].name, file: e.target.files[0]});
    }
  }

  const handleUnselectFile = () => {
    setIsAttachment({selected: false, fileName: null, file: null});
  }

  const isSameSender = (sender) => (sender._id === user.id);

  const newMessagesHandler = useCallback((data) => {
    // console.log(data)
    if (chatId === data.chatId) {
      setMessages(prev => [data.message, ...prev]);
    }
  }, [chatId]);

  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) {
      return;
    }
    setUserTyping(true);
  }, [chatId]);

  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) {
      return;
    }
    setUserTyping(false);
  }, [chatId]);

  const refetchMessagesHandler = ()=>{
    setRefetchMessages(true);
  }

  useEffect(() => {
    socket.emit(CHAT_JOINED, {userId: user?.id, participants: currentChat?.participants})
    dispatch(removeNewMessagesAlert(chatId));
    getOldMessagesHandler(page);

    return () => {
      socket.emit(CHAT_LEFT, {userId: user?.id, participants: currentChat?.participants})
      setMessages([]);
      setRefetchMessages(false);
      setOldMessages([]);
      setMessage('');
      setIsAttachment(false);
      setHasMoreItems(true);
      setPage(1);
    }
  }, [currentChat, refetchMessages]);

  // 5:20
  // const alertListener = useCallback((content)=>{
  //   const messageForAlert = {
  //     content,
  //     sender: {
  //       _id: ""
  //     }
  //   }
  // }, [])

  useEffect(() => {
    socket.on(NEW_MESSAGE, newMessagesHandler);
    socket.on(NEW_ATTACHMENT, newMessagesHandler);
    socket.on(START_TYPING, startTypingListener);
    socket.on(STOP_TYPING, stopTypingListener);
    socket.on(REFETCH_MESSAGES, refetchMessagesHandler)

    return () => {
      socket.off(NEW_MESSAGE, newMessagesHandler);
      socket.off(NEW_ATTACHMENT, newMessagesHandler);
      socket.off(START_TYPING, startTypingListener);
      socket.off(STOP_TYPING, stopTypingListener);
    }
  }, [currentChat])

  return (
    <div className='flex flex-col h-[-webkit-fill-available]'>

      <div className='flex border-b-[1px] border-[#5e5e5e80] items-center py-2 px-2'>
        <i onClick={() => setCurrentChat(null)} className='bx bx-left-arrow-alt text-2xl mr-1 md:hidden'></i>
        <Avatar imgUrl={currentChat?.profilePic} firstName={currentChat?.first_name} lastName={currentChat?.last_name} />
        <div className='flex flex-1 flex-col ml-1'>
          {currentChat.is_group_chat && <span className='text-xl font-light'>{currentChat.group_name}</span>}
          {!currentChat.is_group_chat && <span className='text-xl font-light'>{currentChat.first_name} {currentChat.last_name}</span>}
          {/* <span className='text-xs text-green-500 mt-[-5px] font-light'>Online</span> */}
        </div>
        <span className="flex items-center">
          {currentChat.is_group_chat && currentChat.group_admin === user.id && <i onClick={() => dispatch(openAddMembersModal())} className="fas fa-user-plus text-lg text-[#676767] mr-3"></i>}
          {!currentChat.is_group_chat && <i onClick={() => dispatch(openUserDetailsModal())} className='fas fa-info-circle text-xl text-[#676767]' ></i>}
          {currentChat.is_group_chat && <i onClick={() => dispatch(openGroupDetailsModal())} className='fas fa-info-circle text-xl text-[#676767]' ></i>}
        </span>
      </div>

      <div className='flex-1 px-2 flex flex-col overflow-auto flex flex-col-reverse' id="scrollableDiv">
        {messagesLoading && oldMessages.length === 0 && Array(3).fill(0).map((_,ind) => {
          return <div key={ind} className='flex flex-col'>
            <MessageSkeleton />
            <MessageSkeleton rightAligned={true} />
          </div>
        })}

        {/*Put the scroll bar always on the bottom*/}

        {userTyping && <TypingAnimation />}
        {messages.map(msg => {
          return <RealtimeMessageCard msg={msg} />
        })}
        <InfiniteScroll
          dataLength={oldMessages.length}
          next={loadMore}
          style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
          inverse={true}
          hasMore={hasMoreItems}
          loader={<Loading />}
          scrollableTarget="scrollableDiv"
          // endMessage={
            //   <p style={{ textAlign: 'center' }}>
            //     <b>Yay! You have seen it all</b>
            //   </p>
            // }
            >
          {oldMessages.map(msg => {
            return <MessageCard msg={msg} />
          })}
        </InfiniteScroll>


      </div>

      <div className='px-2 relative'>

        {showAttachmentsMenu && <ClickMenu bottom={50} right={45} closeContextMenuHandler={closeAttachmentsMenuHandler}>
          <div>
            <div className='mb-2'>
              <input className="hidden" onChange={handleAttachmentOpen} type="file" accept=".png,.jpeg,.jpg,.gif " id="imageSelect"></input>
              <label htmlFor="imageSelect" className='hover:text-[#676767] cursor-pointer text-lg'><i className="far fa-image right-[50px]"></i><span> Image</span></label>
            </div>
            <div className='mb-2'>
              <input className="hidden" onChange={handleAttachmentOpen} type="file" accept=".mp3,.wav*" id="audioSelect"></input>
              <label htmlFor="audioSelect" className='hover:text-[#676767] cursor-pointer text-lg'><i className="far fa-file-audio right-[50px]"></i><span> Audio</span></label>
            </div>
            <div className='mb-2'>
              <input className="hidden" onChange={handleAttachmentOpen} type="file" accept=".mp4" id="videoSelect"></input>
              <label htmlFor="videoSelect" className='hover:text-[#676767] cursor-pointer text-lg'><i className="far fa-file-video right-[50px]"></i><span> Video</span></label>
            </div>
            <div className='mb-2'>
              <input className="hidden" onChange={handleAttachmentOpen} type="file" accept=".pdf,.docx" id="fileSelect"></input>
              <label htmlFor="fileSelect" className='hover:text-[#676767] cursor-pointer text-lg'><i className="fas fa-file-word right-[50px]"></i><span> Document</span></label>
            </div>
          </div>
        </ClickMenu>}

        {isAttachment.selected && <div className='absolute top-[-35px] left-5 bg-[#d7d2d2] text-[#4c4c4c] py-1 px-3 rounded-md'>{isAttachment.fileName} <span className='cursor-pointer ml-2' onClick={handleUnselectFile}>x</span></div>}
        <i className='bx bx-smile text-[#676767] absolute top-[4px] text-2xl left-[14px]'></i>
        <textarea value={message} onChange={messageOnchangeHandler} className='border-[1px] border-[#e3e3e3] outline-none h-[40px] overflow-hidden w-[100%] resize-none px-8 py-2 rounded-3xl font-light' placeholder='Type something to send...'></textarea>


        <i onClick={() => setShowAttachmentsMenu((prev) => !prev)} className="fa-solid fa-paperclip text-[#676767] absolute top-[4px] text-2xl right-[50px] cursor-pointer"></i>
        {/* <input className="hidden" onChange={handleAttachmentOpen} ref={attachmentRef} type="file" accept=".xlsx,.docx,audio/*,video/*,image/*" id="fileSelect"></input>
        <label htmlFor="fileSelect"><i className="fa-solid fa-paperclip text-[#676767] absolute top-[4px] text-2xl right-[50px] cursor-pointer"></i></label> */}

        <button className="disabled:cursor-not-allowed" onClick={isAttachment.selected ? sendAttachmentHandler : sendMsgHandler}><i className='bx bxs-send text-[#676767] absolute top-[4px] text-2xl right-[14px]'></i></button>
      </div>

    </div >
  )
}

export default ChatArea;