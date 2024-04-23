import { useRef } from "react";
import { useCreateNewGroupMutation, useGetMyFriendsQuery } from "../../redux/api/api";
import Modal from "../../utils/Modal";
import Avatar from "../../ui/Avatar";
import { toast } from 'react-toastify';
import { closeCreateGroupModal } from "../../redux/reducers/misc";
import { useDispatch } from "react-redux";
import MembersLoadingSkeleton from "../../ui/skeletons/MembersLoadingSkeleton";

const StartGroupChatModal = () => {

  const { isLoading: friendsLoading, data, isError } = useGetMyFriendsQuery();
  const [createGroup, { isLoading: creatingGroup }] = useCreateNewGroupMutation();
  const groupNameRef = useRef();
  const groupProfilePicRef = useRef();
  const selectedMembersRef = useRef();
  const dispatch = useDispatch();

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const groupName = e.target.groupName.value;
    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("groupProfilePic", groupProfilePicRef.current.files[0]);

    for (const member of e.target.selectedMembers) {
      if (member.checked) {
        formData.append("member_ids", member.value);
      }
    }

    try {

      const response = await createGroup(formData);

      if (response.error !== undefined) {
        throw Error(response.error.data.msg);
      }
      toast.success(`Success: ${response.data.msg}`);
      dispatch(closeCreateGroupModal());
    }
    catch (err) {
      toast.error(`Error: ${err.message}`);
    }

  }

  return (
    <Modal hideModal={closeCreateGroupModal}>
      <div className="">
        <h1 className="text-2xl font-light mb-2">Start a group chat</h1>

        <div className="mb-4">
          <form onSubmit={formSubmitHandler} className="flex flex-col mt-4 font-light">
            <label htmlFor="groupName">Group Name</label>
            <input required ref={groupNameRef} name="groupName" className='mb-2 px-2 py-1 border-[1px] border-[#d9d9d9] outline-none rounded-sm' type="text" placeholder="Enter the name of the group"></input>

            <label htmlFor="groupProfilePic">Group Profile Picture</label>
            <input required ref={groupProfilePicRef} name="groupProfilePic" className='mb-2 px-2 py-1 border-[1px] border-[#d9d9d9] outline-none rounded-sm' type="file" accept="image/*"></input>

            <label htmlFor="addPeople">Add Members</label>
            {friendsLoading && Array(3).fill(0).map((_, ind) => {
              return <div key={ind}><MembersLoadingSkeleton /></div>
            })}
            {!friendsLoading && <fieldset>
              {data.friends.map(friend => {
                return <div className="flex justify-between items-center mt-2 border-b-[1px] py-1 border-[#e9e9e9]">
                  <Avatar imgUrl={friend.profilePic?.url} firstName={friend.first_name} lastName={friend.last_name} />
                  <label className="mx-2 flex-1">{friend.first_name + ' ' + friend.last_name}</label>
                  <input className="w-4 h-4 accent-red-500" ref={selectedMembersRef} type="checkbox" name="selectedMembers" value={friend._id} />
                </div>
              })}
              {!friendsLoading && data.friends.length === 0 && <div>
                <h1 className="text-lg font-light text-center">You already have all your friends in this group</h1>
              </div>}
            </fieldset>}


            <div className="w-[max-content] mt-3 ml-auto mr-0">
              <button disabled={creatingGroup} className='bg-[#2d97ff] text-white font-light px-5 py-1 text-lg rounded-md mr-1 disabled:bg-[#bfbfbf] disabled:cursor-not-allowed'>{creatingGroup ? 'Creating Group...' : 'Create Group'}</button>
              <button onClick={() => dispatch(closeCreateGroupModal())} className="bg-[#fd4d5b] text-white rounded-md font-light py-1 px-5 text-lg mr-1">Close</button>
            </div>

          </form>
        </div>

      </div>
    </Modal>
  )
}

export default StartGroupChatModal;
