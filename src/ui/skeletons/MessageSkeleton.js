import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const MessageSkeleton = ({rightAligned}) => {
  return (
    <div className={`bg-[#f5f5f5db] px-3 rounded-xl py-1 inline-block my-2 w-[40%] ${rightAligned ? 'mr-0 ml-auto' : ''}`}>
        <div className='text-lg w-[40%]'><Skeleton /></div>
        <div className='text-base'><Skeleton /></div>
        <div className='text-xs ml-auto mr-0 w-[30%]'><Skeleton /></div>
    </div>
  )
}

export default MessageSkeleton;
