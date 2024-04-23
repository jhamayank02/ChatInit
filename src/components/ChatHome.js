import React, { useContext, useState, useEffect } from 'react'
import ChatArea from './ChatArea'
import Chats from './Chats'
import Avatar from './Avatar';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import NotificationModal from './NotificationModal';
import UserDetailsModal from './UserDetailsModal';
import StartGroupChatModal from './StartGroupChatModal';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNotExists } from '../redux/reducers/auth';
import api, { useLazyCheckIsLoggedInQuery, useLazyLogoutQuery, useMyChatsQuery } from '../redux/api/api';
import { SocketContext } from '../socket';
import Header from './Header';
import SearchModal from './SearchModal';
import MyDetailsModal from './MyDetailsModal';
import GroupDetailsModal from './GroupDetailsModal';
import AddMembers from './AddMembers';

const ChatHome = () => {
  const [showChat, setShowChat] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['uid']);
  const [currentChat, setCurrentChat] = useState(null);
  const user = useSelector(state => state.auth.user);

  const {isNotificationModalOpened, isMyDetailsModalOpened, isCreateGroupModalOpened, isSearchModalOpened, isUserDetailsModalOpened, isGroupDetailsModalOpened, isAddMembersModalOpened} = useSelector(state => state.misc);

  // const [chats, setChats] = useState([]);
  // const [requested, setRequested] = useState([]);
  // const [requests, setRequests] = useState([]);
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  
  const [logout] = useLazyLogoutQuery();
  const {isLoading, data, isError, error, refetch} = useMyChatsQuery("");
  const [checkIsLoggedIn] = useLazyCheckIsLoggedInQuery();

  const dynamicClasses = {
    // hide: 'sm:z-[-1] sm:hidden',
    // show: 'sm:z-[50] sm:block'
    hide: 'hidden',
    show: 'block'
  }

  const loginWithCookie = async ()=>{
    if(cookies?.uid === undefined){
      return navigate('/');
    }

    try{
        // setLoading(true);

        // const response = await fetch("http://localhost:80/api/auth/check-is-logged-in", {
        // const response = await fetch("https://chatinit-backend.onrender.com/api/auth/check-is-logged-in", {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        // })
        // const data = await response.json();
        const response = await checkIsLoggedIn();
        // setLoading(false);
        // console.log(response.data);

        if(response.error !== undefined){
            throw Error(response.error.data.msg || "Something went wrong!!!");
        }
        
        setCookie('uid', response.data.access_token, {maxAge: 1000 * 60 * 60 * 24});
        dispatch(userExists(response.data.user))
        return navigate('/chat')
    }
    catch(error){
        toast.error(`Error: ${error.message}`)
        return navigate('/');
    }
}

  const logoutHandler = async ()=>{
    try{
      const response = await logout();

      if(response.error !== undefined){
        throw Error(response.error.data.msg);
      }

      removeCookie('uid');
      dispatch(userNotExists);
      toast.success('Success: Logged out successfully')
      // dispatch(api.resetApiState())
      return navigate('/');
    }
    catch(err){
      toast.error(`Error: ${err.message}`);
    }
  }

  useEffect(()=>{
      loginWithCookie();

      return ()=>{
        setCurrentChat(null);
      }
  }, [])

  return (
    <>
      {isNotificationModalOpened && <NotificationModal />}
      {isUserDetailsModalOpened && <UserDetailsModal currentChat={currentChat} />}
      {isCreateGroupModalOpened && <StartGroupChatModal />}
      {isSearchModalOpened && <SearchModal />}
      {isMyDetailsModalOpened && <MyDetailsModal />}
      {isGroupDetailsModalOpened && <GroupDetailsModal setCurrentChat={setCurrentChat} currentChat={currentChat} />}
      {isAddMembersModalOpened && <AddMembers currentChat={currentChat} />}
      
      <Header logoutHandler={logoutHandler} />

      <div className='relative w-[100%] bg-white h-[92dvh] flex py-3 px-2'>

        {/* <div className={`w-[100%] overflow-y-scroll ${!currentChat ? dynamicClasses.show : dynamicClasses.hide} md:w-[400px] lg:w-[500px] md:block`}> */}
        <div className={`w-[100%] overflow-y-scroll ${!currentChat ? dynamicClasses.show : dynamicClasses.hide} md:w-[400px] md:block lg:w-[500px]`}>
          {/* <Chats currentChat={currentChat} setCurrentChat={setCurrentChat} requests={requests} chats={chats} requested={requested} /> */}
          <Chats currentChat={currentChat} setCurrentChat={setCurrentChat} />
        </div>

        {/* <div className={`flex-1 bg-[#2a2a2af0] rounded-br-2xl rounded-tr-2xl h-[-webkit-fill-available] overflow-hidden ${showChat ? 'block': 'hidden'}`}> */}
        {/* <div className={`absolute top-0 left-0 w-[100%] h-[-webkit-fill-available] bg-white ${showChat ? 'block z-10': 'hidden z-[-1]'} md:relative md:w-[webkit-fill-available] md:h-[90dvh] md:block md:z-10 ${!currentChat ? dynamicClasses.hide : dynamicClasses.show}`}> */}
        {/* <div className={`bg-white ${!currentChat ? dynamicClasses.hide : dynamicClasses.show} md:relative md:w-[webkit-fill-available] md:h-[90dvh] md:block md:z-10`}> */}
        <div className={`bg-white w-[100%] ${!currentChat ? dynamicClasses.hide : dynamicClasses.show} md:block`}>
          {currentChat === null && <div className={'h-[-webkit-fill-available] relative bg-[#ededed] '}><span className='text-[#727272] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-4xl'>Start Chatting</span></div>}
          {currentChat !== null && <ChatArea currentChat={currentChat} setCurrentChat={setCurrentChat} />}
        </div>

      </div>
      </>
  )
}

export default ChatHome;
