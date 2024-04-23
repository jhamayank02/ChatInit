import Modal from "../../utils/Modal";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { closeUserDetailsModal } from '../../redux/reducers/misc';
import moment from "moment";
import { useGetUserDetailsMutation } from "../../redux/api/api";
import { toast } from "react-toastify";
import DetailsModalSkeleton from "../../ui/skeletons/DetailsModalSkeleton";

const UserDetailsModal = ({currentChat}) => {
    const dispatch = useDispatch();
    
    const [getUserDetails] = useGetUserDetailsMutation();
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        setIsLoading(true);
        getUserDetails({user_id: currentChat?.participants[0]._id})
            .then(response => {
                if(response.error !== undefined){
                    throw Error(response.error.data.msg);
                }
                
                setIsLoading(false);
                setUserDetails(response.data.userDetails);
            })
            .catch(err => toast.error(`Error: ${err.message}`));

        return ()=>{
            setUserDetails(null);
        }
    }, [])

    return (
        <Modal hideModal={closeUserDetailsModal}>
            <div className="">

                <h1 className="text-2xl font-light mb-2">About User</h1>

                {isLoading && <DetailsModalSkeleton />}
                {!isLoading && <div>
                    <a target="_blank" href={userDetails?.profilePic}><img src={userDetails?.profilePic} className="h-[150px] w-[150px] rounded-full mx-auto"></img></a>

                    <div className="mt-4">
                        <p className="text-sm text-[#a39f9fde] font-light">Name</p>
                        <p className="font-light text-xl">{userDetails?.first_name + ' ' + userDetails?.last_name}</p>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-[#a39f9fde] font-light">Email Id</p>
                        <p className="font-light text-lg">{userDetails?.email}</p>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-[#a39f9fde] font-light">Joined</p>
                        <p className="font-light text-lg">{moment.utc(userDetails?.joined).local().startOf('seconds').fromNow()}</p>
                    </div>
                </div>}

                <div className="w-[max-content] ml-auto mr-0">
                    <button onClick={() => dispatch(closeUserDetailsModal())} className="bg-[#fd4d5b] text-white rounded-md font-light py-1 px-5 text-lg">Close</button>
                </div>
            </div>
        </Modal>
    )
}

export default UserDetailsModal;
