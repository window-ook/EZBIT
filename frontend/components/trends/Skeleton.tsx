export function Skeleton() {
    return (
        <div className="col-span-12 sm:col-span-3 animate-pulse">
            <div className="bg-gray-200 rounded-lg h-[150px] w-full mb-2"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );
}