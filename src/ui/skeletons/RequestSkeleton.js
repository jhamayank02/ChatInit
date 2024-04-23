import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RequestSkeleton = () => {
    return (
        <div className='flex items-center bg-[#f5f5f5] py-2 px-2 rounded-md mb-1'>
            <Skeleton circle={true} height={40} width={40} />
            <div className='ml-1 w-[40%] text-lg'><Skeleton /></div>
            <div className='flex justify-end flex-1 gap-x-1'>
                <Skeleton circle={true} height={40} width={40} />
                <Skeleton circle={true} height={40} width={40} />
            </div>
        </div>
    )
}

export default RequestSkeleton;
