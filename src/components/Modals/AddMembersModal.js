import { useDispatch } from "react-redux";
import Modal from "../../utils/Modal";
import { closeAddMembersModal } from "../../redux/reducers/misc";
import { useAddMembersInTheGroupMutation, useGetMyAvailableFriendsMutation } from "../../redux/api/api";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from 'react';
import Avatar from "../../ui/Avatar";
import MembersLoadingSkeleton from "../../ui/skeletons/MembersLoadingSkeleton";

const AddMembersModal = ({ currentChat }) => {
  const dispatch = useDispatch();

  const [getMyAvailableFriends] = useGetMyAvailableFriendsMutation();
  const [addMembers] = useAddMembersInTheGroupMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const selectedMembersRef = useRef();

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const selectedMembers = [];
    for (const member of e.target.selectedMembers) {
      if (member.checked) {
        selectedMembers.push(member.value);
      }
    }

    try {
      const response = await addMembers({ groupId: currentChat?.id, personsToBeAddedIds: selectedMembers });

      if (response.error !== undefined) {
        throw Error(response.error.data.msg);
      }
      toast.success(`Success: ${response.data.msg}`);
      dispatch(closeAddMembersModal());
    }
    catch (err) {
      toast.error(`Error: ${err.message}`);
    }

  }

  useEffect(() => {
    setIsLoading(true);
    getMyAvailableFriends({ groupId: currentChat.id })
    .then(response => {
        if (response.error !== undefined) {
          throw Error(response.error.data.msg);
        }
        setFriends(response.data.availableFriends);
        setIsLoading(false);
      })
      .catch(err => toast.error(`Error: ${err.message}`));

    return () => {
      setIsLoading(false);
      setFriends([]);
    }
  }, [])

  return (
    <Modal hideModal={closeAddMembersModal}>
      <h1 className="text-2xl font-light mb-2">Add Members</h1>

      {isLoading && Array(3).fill(0).map((_, ind) => {
        return <div key={ind}><MembersLoadingSkeleton /></div>
      })}

      {!isLoading && friends.length === 0 && <div>
        <h1 className="text-lg font-light text-center">You already have all your friends in this group</h1>
        <div className="w-[max-content] mt-5 ml-auto mr-0">
          <button onClick={() => dispatch(closeAddMembersModal())} className="bg-[#fd4d5b] text-white rounded-md font-light py-1 px-5 text-lg">Close</button>
        </div>
      </div>}

      {!isLoading && friends.length > 0 && <div>
        <form onSubmit={formSubmitHandler}>
          <fieldset>
            <input className="hidden" ref={selectedMembersRef} name="selectedMembers" value="" />

            {friends.map(friend => {
              return <div className="flex justify-between items-center mt-2 border-b-[1px] py-1 border-[#e9e9e9]">
                <Avatar imgUrl={friend.profilePic?.url} firstName={friend.first_name} lastName={friend.last_name} />
                <label className="mx-2 flex-1 text-lg font-light">{friend.first_name + ' ' + friend.last_name}</label>
                <input className="w-4 h-4 accent-red-500" ref={selectedMembersRef} type="checkbox" name="selectedMembers" value={friend._id} />
              </div>
            })}
          </fieldset>
          <div className="w-[max-content] mt-3 ml-auto mr-0">
            <button className="bg-[#2d97ff] text-white rounded-md font-light py-1 px-5 text-lg mr-1">Add Members</button>
            <button onClick={() => dispatch(closeAddMembersModal())} className="bg-[#fd4d5b] text-white rounded-md font-light py-1 px-5 text-lg">Close</button>
          </div>
        </form>
      </div>}


    </Modal>
  )
}

export default AddMembersModal;
