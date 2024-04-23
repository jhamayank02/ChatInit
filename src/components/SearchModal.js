import React, { useEffect, useState } from 'react';
import Modal from '../utils/Modal';
import { useDispatch } from 'react-redux';
import { closeSearchModal } from '../redux/reducers/misc';
import {useLazySearchUserQuery, useSendFriendRequestMutation} from '../redux/api/api';
import { toast } from 'react-toastify';
import Avatar from './Avatar';
import SearchResultsSkeleton from '../ui/skeletons/SearchResultsSkeleton';

const SearchModal = () => {

  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchUser] = useLazySearchUserQuery();
  const [results, setResults] = useState([]);

  const searchHandler = async () => {
    try{
      setIsLoading(true);
      const response = await searchUser(searchQuery);
      
      console.log(response.data.users)
      if(response.error !== undefined){
        throw Error(response.error.data.msg);
      }

      setResults(response.data.users);
      setIsLoading(false);
    }
    catch(err){
      toast.error(`Error: ${err.message}`);
    }
  }

  const [sendFriendRequest] = useSendFriendRequestMutation();

  const sendFriendRequestHandler = async (user_id)=> {
    try{
      const response = await sendFriendRequest({personToWhichRequestSentId: user_id});
      
      if(response.error !== undefined){
        throw Error(response.error.data.msg);
      }

      toast.success(`Success: ${response.data.msg}`);
    }
    catch(err){
      toast.error(`Error: ${err.message}`);
    }
  }

  useEffect(()=>{

    if(!searchQuery) return;

    const timeOutId = setTimeout(() => {
      searchHandler();
    }, 2000);

    return ()=>{
      setResults('');
      clearTimeout(timeOutId);
    }

  }, [searchQuery])

  return (
    <Modal hideModal={closeSearchModal}>
      <div>
        <div className='w-[100%] pl-1 pr-2 relative mb-2'>
          <textarea id="searchBox" onChange={(e) => setSearchQuery(e.target.value)} className='border-[1px] border-[#e3e3e3] font-light outline-none overflow-hidden px-1 py-1 text-lg rounded-md w-[100%] resize-none h-[40px] text-[#000000bf]' placeholder='Search people'></textarea>

          <span className='absolute top-[6px] right-[12px]'><i className='bx bx-search text-lg text-[#000000bf]'></i></span>
        </div>

        {searchQuery === '' && <div className='font-light text-xl text-center'>Start searching your favourite ones!</div>}

        {isLoading && Array(3).fill(0).map((_,ind)=>{
          return <div key={ind}><SearchResultsSkeleton /></div>
        })}

        {!isLoading && searchQuery !== '' && results.length === 0 && <div className='font-light text-xl text-center'>No user found</div>}
        
        {!isLoading && results.length > 0 && results.map(({_id, first_name, last_name, profilePic}) => {
          return <div key={_id} className='flex items-center justify-between mb-1'>
            <Avatar imgUrl={profilePic} firstName={first_name} />
            <div className='flex-1 mx-2 font-light text-lg'>{first_name + ' ' + last_name}</div>
            <i className="fas fa-plus-circle text-2xl mx-2 text-[#d5d3d0] cursor-pointer" onClick={() => sendFriendRequestHandler(_id)}></i>
          </div>
        })}

        <div className="w-[max-content] mt-3 ml-auto mr-0">
          <button onClick={() => dispatch(closeSearchModal())} className="bg-[#fd4d5b] text-white rounded-md font-light py-1 px-5 text-lg mr-1">Close</button>
        </div>
      </div>
    </Modal>
  )
}

export default SearchModal;
