import { useDispatch, useSelector } from "react-redux";
import Modal from "../utils/Modal";
import { closeMyDetailsModal } from "../redux/reducers/misc";
import moment from "moment";

const MyDetailsModal = () => {
    const dispatch = useDispatch();
    const {first_name, last_name, email, profilePic, joined} = useSelector(state => state.auth.user);

    return (
        <Modal hideModal={closeMyDetailsModal}>

            <h1 className="text-2xl font-light mb-2">Your Profile</h1>

            <div>
                <img src={profilePic} className="h-[150px] w-[150px] rounded-full mx-auto"></img>

                <div className="mt-4">
                    <p className="text-sm text-[#a39f9fde] font-light">Name</p>
                    <p className="font-light text-xl">{first_name + ' ' + last_name}</p>
                </div>

                <div className="mt-2">
                    <p className="text-sm text-[#a39f9fde] font-light">Email Id</p>
                    <p className="font-light text-lg">{email}</p>
                </div>

                <div className="mt-2">
                    <p className="text-sm text-[#a39f9fde] font-light">Joined</p>
                    <p className="font-light text-lg">{moment.utc(joined).local().startOf('seconds').fromNow()}</p>
                </div>
            </div>


            <div className="w-[max-content] mt-2 ml-auto mr-0">
                <button onClick={() => dispatch(closeMyDetailsModal())} className="bg-[#fd4d5b] text-white rounded-md font-light py-1 px-5 text-lg">Close</button>
            </div>
        </Modal>
    )
}

export default MyDetailsModal;
