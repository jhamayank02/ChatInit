import Skeleton from "react-loading-skeleton";

const MembersLoadingSkeleton = () => {
  return (
    <div className="flex items-center mt-2">
      <Skeleton circle={true} height={50} width={50} />
      <div className="mx-2 flex-1 text-lg"><Skeleton width={"50%"} /></div>
      <div><Skeleton circle={false} height={20} width={20} /></div>          
    </div>
  )
}

export default MembersLoadingSkeleton;
