import { useDispatch, useSelector } from "react-redux";
import { openNotificationModal, openMyDetailsModal } from "../redux/reducers/misc";
import ClickMenu from '../utils/ClickMenu';
import { useState } from "react";
import moment from "moment";
import { useDeleteAccountMutation } from "../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { userNotExists } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";

const Header = ({ logoutHandler }) => {
    const user = useSelector(state => state.auth.user);
    const notificationCount = useSelector(state => state.notification.notificationCount);
    const [cookies, setCookie, removeCookie] = useCookies(['uid']);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [deleteAccount] = useDeleteAccountMutation();
    const [userDetailsLoading, setUserDetailsLoading] = useState(false);
    const [showUserDetailsMenu, setShowUserDetailsMenu] = useState(false);
    const closeUserDetailsMenuHandler = () => { setShowUserDetailsMenu(false); }

    const deleteAccountHandler = async () => {
        try {
            const response = await deleteAccount();

            if (response.error !== undefined) {
                throw Error(response.error.data.msg);
            }

            removeCookie('uid');
            dispatch(userNotExists);
            toast.success(`Success: ${response.data.msg}`);
            return navigate('/');
        }
        catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    }

    return (
        <nav className='relative flex w-[100%] justify-between items-center bg-[#2d97ff] py-2 px-2'>

            {showUserDetailsMenu && <ClickMenu top={40} right={50} closeContextMenuHandler={closeUserDetailsMenuHandler}>

                <div className="w-[250px]">
                    <h1 className="text-2xl font-light mb-2">Your Profile</h1>

                    <div>
                        <img src={user?.profilePic} className="h-[150px] w-[150px] rounded-full mx-auto"></img>

                        <div className="mt-4">
                            <p className="text-sm text-[#a39f9fde] font-light">Name</p>
                            <p className="font-light text-xl">{user?.first_name + ' ' + user?.last_name}</p>
                        </div>

                        <div className="mt-2">
                            <p className="text-sm text-[#a39f9fde] font-light">Email Id</p>
                            <p className="font-light text-lg">{user?.email}</p>
                        </div>

                        <div className="mt-2">
                            <p className="text-sm text-[#a39f9fde] font-light">Joined</p>
                            <p className="font-light text-lg">{moment.utc(user?.joined).local().startOf('seconds').fromNow()}</p>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-sm mt-4 mb-2 text-[#a39f9fde]">Other Related Information</h1>
                        <p onClick={deleteAccountHandler} className="font-light text-lg mb-1 text-red-400 hover:underline cursor-pointer">Delete account</p>

                    </div>


                    <div className="w-[max-content] mt-2 ml-auto mr-0">
                        <button onClick={closeUserDetailsMenuHandler} className="bg-[#fd4d5b] text-white rounded-md font-light py-1 px-5 text-lg">Close</button>
                    </div></div>
            </ClickMenu>}

            <div className='text-white font-semibold text-2xl font-light'>ChatInit()</div>

            <div className='flex items-center'>
                <div className='mr-4 relative'>
                    <i onClick={() => dispatch(openNotificationModal())} className='fa-solid fa-user-group text-white'></i>
                    {notificationCount > 0 && <span className='absolute top-[-4px] right-[-11px] text-white bg-[#f94f4f] rounded-full py-[1px] px-2'>{notificationCount}</span>}
                </div>
                {/* <div onClick={() => dispatch(openMyDetailsModal())} className='text-white text-lg font-light cursor-pointer'>Welcome {user?.first_name}<i className='bx bxs-down-arrow text-xs ml-1'></i></div> */}
                <div onClick={() => setShowUserDetailsMenu(true)} className='text-white text-lg font-light cursor-pointer'>Welcome {user?.first_name}<i className='bx bxs-down-arrow text-xs ml-1'></i></div>
                <i onClick={logoutHandler} className="bx bx-exit text-white ml-4 text-2xl"></i>
            </div>

        </nav>
    )
}

export default Header;
