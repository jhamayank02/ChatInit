import React, { useContext, useEffect, useState } from 'react';
import ChatAddressCard from '../../ui/ChatAddressCard';
import Avatar from '../../ui/Avatar';
import { useCookies } from "react-cookie";
import { toast } from 'react-toastify';
import { useLazySearchUserQuery, useSendFriendRequestMutation, useMyChatsQuery, useLazyRequestsSentByMeQuery, useRequestsSentByMeQuery, useRequestsReceivedByMeQuery, useAcceptFriendRequestMutation, useRejectFriendRequestMutation } from '../../redux/api/api';
import ChatAddressCardSkeleton from '../../ui/skeletons/ChatAddressCardSkeleton';
import Skeleton from 'react-loading-skeleton';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events';
import { SocketContext } from '../../socket';
import { useDispatch, useSelector } from "react-redux";
import { incrementNotificationCount, setNewMessagesAlert } from '../../redux/reducers/notification';
import { useCallback } from 'react';
import { getOrSaveFromLocalStorage } from '../../lib/features';
import { openCreateGroupModal, openSearchModal } from '../../redux/reducers/misc';

const fetchUserData = async (uid) => {

  const response = await fetch("http://localhost:80/api/users/user-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      uid: uid
    })
  })

  return response.json();
}

const Chats = ({ setCurrentChat, toggleUserDetailsModal, toggleStartGroupChatModal, currentChat }) => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const newMessagesAlert = useSelector(state => state.notification.newMessagesAlert);
  const { user } = useSelector(state => state.auth);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [acceptRequest] = useAcceptFriendRequestMutation();
  const [rejectRequest] = useRejectFriendRequestMutation();

  const {isLoading:chatsLoading, data:chatsData, refetch:refetchChats} = useMyChatsQuery("");
  // console.log(chatsData)

  useEffect(()=>{
    getOrSaveFromLocalStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert});
  }, [newMessagesAlert]);

  const newRequestNotificationHandler = ()=>{
    return dispatch(incrementNotificationCount());
  }

  // TODO - Handle initial null state
  const newMessageAlertHandler = useCallback((data)=>{
    // console.log((data?.senderId !== user?.id) && (currentChat?.id !== data?.chatId))
    // console.log(data?.senderId, user?.id, currentChat?.id, data?.chatId)
    if((data?.senderId !== user?.id) && (currentChat?.id !== data?.chatId)){
      return dispatch(setNewMessagesAlert(data));
    }
  }, [currentChat?.id, user])

  const onlineUsersHandler = (data)=>{
    setOnlineUsers(data);
  }

  useEffect(()=>{
    socket.on(NEW_REQUEST, newRequestNotificationHandler);
    socket.on(NEW_MESSAGE_ALERT, newMessageAlertHandler);
    socket.on(REFETCH_CHATS, refetchChats);
    socket.on(ONLINE_USERS, onlineUsersHandler);
    
    return ()=>{
      socket.off(NEW_REQUEST, newRequestNotificationHandler);
      socket.off(NEW_MESSAGE_ALERT, newMessageAlertHandler);
      socket.off(REFETCH_CHATS, refetchChats);
      socket.off(ONLINE_USERS, onlineUsersHandler);
    }
  }, []);

  return (
    <div className='relative'>

      <div onClick={() => dispatch(openSearchModal())} className='text-lg mt-1 cursor-pointer font-light hover:text-[#404040]'><span className='mr-1'><i className='bx bx-user'></i></span>Add a person</div>
      <div onClick={() => dispatch(openCreateGroupModal())} className='text-lg mt-1 cursor-pointer font-light hover:text-[#404040]'><span className='mr-1'><i className='bx bx-group'></i></span>Start a group chat</div>

      <div className='chat-container py-2 px-2'>

        {/* <div className=' text-2xl mb-1 font-light'>Requests Sent</div>
        <div className=''>
          {requestedLoading && <div>Loading</div>}
          {!requestedLoading && requestedData.requests.length === 0 && <div>Your all requests got accepted.</div>}
          {!requestedLoading && requestedData.requests.length > 0 && requestedData.requests.map(req => {
            return <div key={req._id} className='flex items-center bg-[#f5f5f5] py-2 px-2 rounded-md mb-1'>
              <Avatar firstName={req.receiver.first_name} lastName={req.receiver.last_name} />
              <div className='ml-1 flex-1 text-lg font-light'>{req.receiver.first_name} {req.receiver.last_name}</div>
              <span className='font-light text-sm'>Pending</span>
            </div>
          })
          }
        </div> */}

        {/* <div className='text-2xl mb-1 font-light mt-2'>Requests Received</div>
        <div className=''>
          {requestsLoading && <div>Loading</div>}
          {!requestsLoading && requestsData.requests.length === 0 && <div>No requests.</div>}
          {!requestsLoading && requestsData.requests.length > 0 && requestsData.requests.map(request => {
            return <div key={request._id} className='flex items-center bg-[#f5f5f5] py-2 px-2 rounded-md mb-1'>
              <Avatar firstName={request.sender.first_name} lastName={request.sender.last_name} />
              <div className='ml-1 flex-1 text-lg font-light'>{request.sender.first_name} {request.sender.last_name}</div>
              {request.status === "Rejected" && <span>Rejected</span>}
              {request.status !== "Rejected" && <div>
                <span onClick={()=>acceptRequestHandler(request._id)} className='font-light mr-1 text-lg bg-[#82e17c] rounded-full py-1 px-3 text-white hover:scale-105'><i className="fa-solid fa-check"></i></span>
              <span onClick={()=>rejectRequestHandler(request._id)} className='font-light text-lg bg-[#f96767] rounded-full py-1 px-3 text-white hover:scale-105'><i className="fa-solid fa-xmark"></i></span>
              </div>}
            </div>
          })
          }
        </div> */}

        <div className='text-2xl mb-1 font-light mt-2'>Messages</div>

        <div className='chats'>

          {chatsLoading && Array(5).fill(0).map((_,ind)=>{
            return <div key={ind}><ChatAddressCardSkeleton /></div>
          })}
          
          {!chatsLoading && chatsData.chats.length === 0 && <h1 className='text-lg font-light text-center'>Add people to start chatting.</h1>}

          {!chatsLoading && chatsData.chats.length > 0 && chatsData.chats.map(chat => {
            return <div key={chat._id}>
                <ChatAddressCard onlineUsers={onlineUsers} currentChat={currentChat} setCurrentChat={setCurrentChat} chatDetails={chat} />
              </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default Chats;
