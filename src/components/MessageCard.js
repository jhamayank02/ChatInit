import { useSelector } from "react-redux";
import ClickMenu from "../utils/ClickMenu";
import moment from "moment";
import { useState } from "react";
import { useDeleteMessageMutation } from "../redux/api/api";
import { toast } from "react-toastify";

const MessageCard = ({msg}) => {

    const user = useSelector(state => state.auth.user);
    const isSameSender = (sender) => (sender._id === user.id);

    const [showMenu, setShowMenu] = useState(false);
    const [deleteMessage] = useDeleteMessageMutation();

    const deleteMsgHandler = async ()=>{
        try{
            const response = await deleteMessage({chat_id: msg.chat, msg_id: msg._id})
            if(response.error !== undefined){
                throw Error(response.error.data.msg);
            }

            toast.success(`Success: ${response.data.msg}`);
        }
        catch(err){
            toast.error(`Error: ${err.message}`);
        }
    }

    const openMenuHandler = (e)=>{
        e.preventDefault();
        setShowMenu(true);
    }

    const closeMenuHandler = ()=>{
        setShowMenu(false);
    }

    return (
        <div key={msg._id} className={`bg-[#d1d1d157] px-3 rounded-xl py-1 inline-block my-2 w-[max-content] max-w-[70%] min-w-[200px] ${isSameSender(msg.sender) ? 'ml-auto' : ''}`}>
            {isSameSender(msg.sender) && <div className='text-lg font-medium text-sm flex items-center justify-between relative'>
                <span className="text-[#2d7fff]">You</span>
                {!msg.deleted && <span onClick={openMenuHandler} className="cursor-pointer text-[#676767]"><i className="fa-solid fa-ellipsis-vertical"></i></span>}
                {showMenu && <ClickMenu top={10} right={8} closeContextMenuHandler={closeMenuHandler}><div><span onClick={deleteMsgHandler} className="hover:text-[#727272] cursor-pointer">Delete</span></div></ClickMenu>}
            </div>}
            {!isSameSender(msg.sender) && <div className='text-lg font-medium text-sm text-[#f70000d9]'>{msg.sender.first_name + ' ' + msg.sender.last_name}</div>}


            {(msg?.attachment?.mimetype === 'image/jpeg' || msg?.attachment?.mimetype === 'image/jpg' || msg?.attachment?.mimetype === 'image/png' || msg?.attachment?.mimetype === 'image/gif') && <div className='text-base text-[#000000] font-light'><a target='_blank' href={msg.attachment.url}><img className='h-[100px] w-[150px] object-contain' src={msg.attachment.url}></img></a></div>}
            {(msg?.attachment?.mimetype === 'application/pdf' || msg?.attachment?.mimetype === 'application/docx') && <div className='text-base text-[#000000] font-light'><a target='_blank' href={msg.attachment.url}><iframe className='h-[100px] w-[150px] object-contain' src={msg.attachment.url}></iframe></a></div>}
            {(msg?.attachment?.mimetype === 'audio/mp3' || msg?.attachment?.mimetype === 'audio/wav') && <div className='text-base text-[#000000] font-light'><a target='_blank' href={msg.attachment.url}><iframe className='h-[100px] w-[150px] object-contain' src={msg.attachment.url}></iframe></a></div>}



            {msg?.deleted && <div className='text-base text-[#918d8d] font-light'><i className="fas fa-ban"></i><span> {msg?.message}</span></div>}
            {!msg?.deleted && <div className='text-base text-[#000000] font-light'>{msg?.message}</div>}
            <div className='text-xs text-[#000000] ml-auto mr-0 w-[max-content] font-light'>{moment.utc(msg.createdAt).local().startOf('seconds').fromNow()}</div>
        </div>
    )
}

export default MessageCard
