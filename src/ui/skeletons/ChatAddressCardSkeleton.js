import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ChatAddressCardSkeleton = () => {
  return (
    <div className='flex items-center w-[100%] py-1 px-1 bg-[#f5f5f5db] rounded mb-1'>
      <div className='w-[18%] text-center'><Skeleton circle={true} height={40} width={40} /></div>
      <div className='w-[82%]'>
        <div className='text-lg w-[90%]'><Skeleton /></div>
        <div className='text-sm w-[40%]'><Skeleton /></div>
      </div>
    </div>
  )
}

export default ChatAddressCardSkeleton;
