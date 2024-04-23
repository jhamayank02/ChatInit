import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useContext } from 'react';
import Modal from '../utils/Modal';
import { closeGroupDetailsModal } from '../redux/reducers/misc';
import { useGetGroupDetailsMutation, useLeaveGroupMutation, useRemoveFromGroupMutation, useDeleteGroupMutation } from '../redux/api/api';
import { toast } from 'react-toastify';
import Avatar from './Avatar';
import moment from 'moment';
import DetailsModalSkeleton from '../ui/skeletons/DetailsModalSkeleton';
import { SocketContext } from '../socket';
import { REFETCH_MEMBERS } from '../constants/events';

const GroupDetailsModal = ({currentChat, setCurrentChat}) => {

    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    const user = useSelector(state => state.auth.user);
    const [getGroupDetails] = useGetGroupDetailsMutation();
    const [removeFromGroup] = useRemoveFromGroupMutation();
    const [deleteGroup] = useDeleteGroupMutation();
    const [leaveGroup] = useLeaveGroupMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [groupDetails, setGroupDetails] = useState(null);

    const deleteGroupHandler = async ()=>{
        try{
            const response = await deleteGroup({group_id: currentChat?.id});

            if(response.error !== undefined){
                throw Error(response.error.data.msg);
            }

            toast.success(`Success: ${response.data.msg}`);
            setCurrentChat(null);
        }
        catch(err){
            toast.error(`Error: ${err.message}`);
        }

    }

    const removeUserHandler = async (user_id)=>{
        try{
            const response = await removeFromGroup({personToBeRemovedId: user_id, groupId: currentChat?.id});

            if(response.error !== undefined){
                throw Error(response.error.data.msg);
            }

            toast.success(`Success: ${response.data.msg}`);
        }
        catch(err){
            toast.error(`Error: ${err.message}`);
        }
    }

    const leaveGroupHandler = async ()=>{
        try{
            const response = await leaveGroup({groupId: currentChat?.id});
            console.log(response)
            if(response.error !== undefined){
                throw Error(response.error.data.msg);
            }

            setCurrentChat(null);
            toast.success(`Success: ${response.data.msg}`);
        }
        catch(err){
            toast.error(`Error: ${err.message}`);
        }
    }

    const fetchGroupDetailsHandler = async ()=>{
        try{
            setIsLoading(true);
            const response = await getGroupDetails({chat_id: currentChat.id});

            if(response.error !== undefined){
                throw Error(response.error.data.msg);
            }

            setGroupDetails(response.data.groupDetails);
            setIsLoading(false);
        }
        catch(err){
            toast.error(`Error: ${err.message}`)
        }
    }

    useEffect(()=>{
        socket.on(REFETCH_MEMBERS, fetchGroupDetailsHandler);

        return ()=>{
            socket.off(REFETCH_MEMBERS, fetchGroupDetailsHandler);
        }

    }, []);

    useEffect(()=>{
        fetchGroupDetailsHandler();

        return ()=>{
            setGroupDetails(null);
        }
    }, [])

  return (
    <Modal hideModal={closeGroupDetailsModal}>
            <div className="">

                <h1 className="text-2xl font-light mb-2">About Group</h1>

                {isLoading && <DetailsModalSkeleton />}
                {!isLoading && <div>
                    <a target='_blank' href={groupDetails?.groupProfilePic}><img src={groupDetails?.groupProfilePic} className="h-[150px] w-[150px] rounded-full mx-auto"></img></a>

                    <div className="mt-4">
                        <p className="text-sm text-[#a39f9fde] font-light">Group Name</p>
                        <p className="font-light text-xl">{groupDetails?.groupName}</p>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-[#a39f9fde] font-light">Created</p>
                        <p className="font-light text-lg">{moment.utc(groupDetails?.joined).local().startOf('seconds').fromNow()}</p>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-[#a39f9fde] font-light">Members</p>
                        {groupDetails?.participants.map(participant => {
                            return <div key={participant._id} className='flex items-center mt-1 border-b-[1px] border-[#e9e9e9] py-1 justify-between'>
                                <Avatar imgUrl={participant?.profilePic?.url} firstName={participant?.first_name} />
                                <div className='ml-2 font-light flex-1'>
                                    <span className='text-lg'>{participant?.first_name + ' ' + participant?.last_name}</span>
                                    {groupDetails.groupAdmin === participant._id && <span className='ml-1 text-sm text-[#0aa70a]'>(Admin)</span>}
                                </div>
                                {groupDetails.groupAdmin === user.id && groupDetails.groupAdmin !== participant._id && <div className="text-xl text-[#ff6666]"><i onClick={()=>removeUserHandler(participant._id)} className="fas fa-minus-circle"></i></div>}
                            </div>
                        })}
                    </div>

                    {groupDetails?.groupAdmin === user?.id && <div onClick={deleteGroupHandler} className="w-[max-content] ml-auto mr-0 mt-3 font-light text-lg mb-3 text-red-400 hover:underline cursor-pointer">Delete group</div>}
                </div>}

                <div className="w-[max-content] mt-3 ml-auto mr-0">
                    <button onClick={leaveGroupHandler} className="bg-[#2d97ff] text-white rounded-md font-light py-1 px-5 text-lg mr-1">Leave Group</button>
                    <button onClick={() => dispatch(closeGroupDetailsModal())} className="bg-[#fd4d5b] text-white rounded-md font-light py-1 px-5 text-lg">Close</button>
                </div>
            </div>
    </Modal>
  )
}

export default GroupDetailsModal;
