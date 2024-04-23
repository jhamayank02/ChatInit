import { useContext, useEffect, useState } from "react";
import Modal from "../utils/Modal";
import { useCookies } from "react-cookie";
import { toast } from 'react-toastify';
import { useAcceptFriendRequestMutation, useRejectFriendRequestMutation, useRequestsReceivedByMeQuery } from "../redux/api/api";
import Avatar from "./Avatar";
import { SocketContext } from "../socket";
import { NEW_REQUEST, REFETCH_REQUESTS } from "../constants/events";
import { useDispatch } from "react-redux";
import { resetNotificationCount } from "../redux/reducers/notification";
import RequestSkeleton from "../ui/skeletons/RequestSkeleton";
import { closeNotificationModal } from "../redux/reducers/misc";

const NotificationModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const socket = useContext(SocketContext);
    const dispatch = useDispatch();

    const [acceptRequest] = useAcceptFriendRequestMutation();
    const [rejectRequest] = useRejectFriendRequestMutation();

    const { data: requestsData, error: requestsError, isLoading: requestsLoading, refetch:refetchRequests } = useRequestsReceivedByMeQuery();
    console.log(requestsData)


    const acceptRequestHandler = async (req_id) => {
        try {
            const response = await acceptRequest({ requestId: req_id });
            // console.log(response);
            if (response.error !== undefined) {
                throw Error(response.error.data.msg);
            }

            toast.success(`Success: ${response.data.msg}`);
        }
        catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    }

    const rejectRequestHandler = async (req_id) => {
        try {
            const response = await rejectRequest({ requestId: req_id });
            // console.log(response);
            if (response.error !== undefined) {
                throw Error(response.error.data.msg);
            }

            toast.success(`Success: ${response.data.msg}`);
        }
        catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    }

    useEffect(()=>{
        socket.on(REFETCH_REQUESTS, refetchRequests);

        return ()=>{
            socket.off(REFETCH_REQUESTS, refetchRequests);
        }
    }, [])

    useEffect(() => {
        dispatch(resetNotificationCount());
    }, [])

    return (
        <Modal hideModal={closeNotificationModal} top="50px" right="120px">
            <div className="">
                <h1 className="text-2xl font-light mb-2">Requests</h1>
                {requestsLoading && Array(3).fill(0).map((ind) => {
                    return <div key={ind}><RequestSkeleton /></div>
                })}

                {!requestsLoading && requestsData.requests.length === 0 && <h1 className="text-lg font-light text-center">No requests found</h1>
}

                {!requestsLoading && requestsData.requests.map(req => {
                    return <div key={req._id} className='flex items-center bg-[#f5f5f5] py-2 px-2 rounded-md mb-1'>
                        {!req.sender?.profilePic && <Avatar firstName={req.sender.first_name} lastName={req.sender.last_name} />}
                        {req.sender?.profilePic && <Avatar imgUrl={req.sender.profilePic.url} />}
                        <div className='ml-1 flex-1 text-lg font-light'>{req.sender.first_name} {req.sender.last_name}</div>
                        <span onClick={() => acceptRequestHandler(req._id)} className='font-light mr-1 text-lg bg-[#82e17c] rounded-full py-1 px-3 text-white hover:scale-105'><i className="fa-solid fa-check"></i></span>
                        <span onClick={() => rejectRequestHandler(req._id)} className='font-light text-lg bg-[#f96767] rounded-full py-1 px-3 text-white hover:scale-105'><i className="fa-solid fa-xmark"></i></span>
                    </div>
                })}

                <div className="w-[max-content] mt-2 ml-auto mr-0">
                    <button onClick={() => dispatch(closeNotificationModal())} className="bg-[#fd4d5b] text-white rounded-md font-light py-1 px-5 text-lg">Close</button>
                </div>
            </div>
        </Modal>
    )
}

export default NotificationModal
