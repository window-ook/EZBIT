interface ISkeleton {
    height?: string;
}

export function Skeleton({ height = 'h-[100%]' }: ISkeleton) {
    return (
        <div className="size-full animate-pulse">
            <div className={`bg-slate-200 rounded-lg ${height} w-full`}></div>
        </div>
    );
}