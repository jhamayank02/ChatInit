import Avatar from "./Avatar";
import { useSelector } from 'react-redux';
import { useState } from "react";
import ClickMenu from "../utils/ClickMenu";
import { toast } from 'react-toastify';
import { useUnfriendMutation } from "../redux/api/api";

const ChatAddressCard = ({ chatDetails, currentChat, setCurrentChat, onlineUsers }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const newMessagesAlert = useSelector(state => state.notification.newMessagesAlert);
  const [unfriend] = useUnfriendMutation();
  let index, alerts = 0;

  if (currentChat === null || currentChat.id !== chatDetails._id) {
    index = newMessagesAlert.findIndex(item => item.chatId === chatDetails._id);
    alerts = index === -1 ? 0 : newMessagesAlert[index].count;
  }


  const isOnline = !chatDetails?.is_group_chat && onlineUsers.includes(chatDetails?.participants[0]?._id);

  const setCurrentChatHandler = () => {
    if (chatDetails.is_group_chat) {
      setCurrentChat({
        id: chatDetails._id,
        is_group_chat: chatDetails.is_group_chat,
        group_name: chatDetails.chatName,
        group_admin: chatDetails.group_admin,
        participants: chatDetails.participants,
        profilePic: chatDetails?.groupProfilePic?.url
      })
    }
    else {
      setCurrentChat({
        id: chatDetails._id,
        is_group_chat: chatDetails.is_group_chat,
        first_name: chatDetails.participants[0].first_name,
        last_name: chatDetails.participants[0].last_name,
        email: chatDetails.participants[0].email,
        participants: chatDetails.participants,
        profilePic: chatDetails.participants[0].profilePic.url
      })
    }
  }

  const contextMenuHandler = (e) => {
    e.preventDefault();

    setShowContextMenu(true);
  }

  const closeContextMenuHandler = () => {
    setShowContextMenu(false);
  }

  const unFriendHandler = async (id) => {
    try {
      const response = await unfriend({another_user_id: id});

      console.log(response)
      if(response.error !== undefined){
        throw Error(response.error.data.msg);
      }

      setCurrentChat(null);
      toast.success(response.data.msg);
    }
    catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  }

  return (
    <div onContextMenu={contextMenuHandler} onClick={setCurrentChatHandler} className="relative border-b-[1px] border-[#e9e9e9] cursor-pointer flex gap-x-2 items-center py-2 px-2 hover:bg-[#dfdfdf] rounded mb-1">

      {showContextMenu && !chatDetails.is_group_chat && <ClickMenu closeContextMenuHandler={closeContextMenuHandler} top={30} right={0}>
        <div>
          <div className="hover:text-[#727272] cursor-pointer" onClick={() => unFriendHandler(chatDetails.participants[0]?._id)}>Unfriend</div>
          {/* {chatDetails.is_group_chat && <div className="hover:text-[#727272] cursor-pointer">Delete Group</div>} */}
        </div>
      </ClickMenu>}

      {!chatDetails.is_group_chat && <Avatar imgUrl={chatDetails.participants[0]?.profilePic?.url} />}
      {chatDetails.is_group_chat && <Avatar imgUrl={chatDetails?.groupProfilePic?.url || "https://images.unsplash.com/photo-1580442374555-3def8fb41738?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} />}
      <div className="flex-1">

        <div className="flex items-center justify-between">
          {!chatDetails.is_group_chat && <div className="text-lg font-light">
            <span>{chatDetails.participants[0].first_name} {chatDetails.participants[0].last_name}</span>
            {isOnline && <i className="fas fa-circle mx-1 text-xs text-[#048f04ba]"></i>}
            </div>}
          {chatDetails.is_group_chat && <div className="text-lg font-light">{chatDetails.chatName}</div>}
          {alerts > 0 && <span className="text-sm font-normal">{alerts} New Messages</span>}
        </div>

        {chatDetails?.latestMessage?.message !== "" && <div className="text-sm mt-[-4px] font-light">{chatDetails?.latestMessage?.message}</div>}
        {chatDetails?.latestMessage?.message === "" && chatDetails?.latestMessage?.attachment !== undefined && <div className="text-sm mt-[-4px] font-light">Attachment</div>}

      </div>
      {/* <span className="text-xs font-light">9:30 pm</span> */}
    </div>
  )
}

export default ChatAddressCard;
