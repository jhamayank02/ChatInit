import Skeleton from "react-loading-skeleton";

const DetailsModalSkeleton = () => {
    return (
        <div>
            <div className="mx-auto w-[max-content]"><Skeleton height={150} width={150} circle={true} /></div>
            <div className="mt-4">
                <p className="text-sm w-[20%]"><Skeleton /></p>
                <p className="text-xl w-[40%]"><Skeleton /></p>
            </div>

            <div className="mt-2">
                <p className="text-sm w-[20%]"><Skeleton /></p>
                <p className="text-lg w-[40%]"><Skeleton /></p>
            </div>

            <div className="mt-2">
                <p className="text-sm w-[20%]"><Skeleton /></p>
                <p className="text-lg w-[40%]"><Skeleton /></p>
            </div>
        </div>
    )
}

export default DetailsModalSkeleton;
