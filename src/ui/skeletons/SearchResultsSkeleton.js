import Skeleton from "react-loading-skeleton";

const SearchResultsSkeleton = () => {
  return (
    <div className='flex items-center justify-between mb-1'>
        <div className="flex-1 flex items-center">
            <Skeleton circle={true} height={40} width={40} />
            <div className='mx-2 text-lg w-[40%]'><Skeleton /></div> 
        </div>
        <Skeleton circle={true} height={30} width={30} />
    </div>
  )
}

export default SearchResultsSkeleton;
