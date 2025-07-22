interface ISkeleton {
    height?: string;
    type?: 'default' | 'exchange-rate' | 'news-list' | 'coin-list' | 'youtube-grid';
}

export function SkeletonForTrends({ height = 'h-[100%]', type = 'default' }: ISkeleton) {
    const baseClasses = "animate-pulse bg-slate-200 rounded-lg";

    // 기본 단순 박스 형태
    if (type === 'default') {
        return (
            <div className="size-full animate-pulse">
                <div className={`${baseClasses} ${height} w-full`}></div>
            </div>
        );
    }

    // 환율 정보 레이아웃
    if (type === 'exchange-rate') {
        return (
            <div className={`w-full ${height} animate-pulse p-4 bg-white rounded-lg border`}>
                <div className="flex justify-between items-center mb-3">
                    <div className={`${baseClasses} h-6 w-24`}></div>
                    <div className={`${baseClasses} h-5 w-16`}></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className={`${baseClasses} h-4 w-12`}></div>
                            <div className={`${baseClasses} h-6 w-20`}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 뉴스 리스트 레이아웃
    if (type === 'news-list') {
        return (
            <div className={`w-full ${height} animate-pulse p-4 bg-white rounded-lg border`}>
                <div className={`${baseClasses} h-6 w-32 mb-4`}></div>
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className={`${baseClasses} h-4 w-full`}></div>
                            <div className={`${baseClasses} h-4 w-4/5`}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 코인 리스트 레이아웃
    if (type === 'coin-list') {
        return (
            <div className={`w-full ${height} animate-pulse p-4 bg-white rounded-lg border`}>
                <div className={`${baseClasses} h-6 w-40 mb-4`}></div>
                <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className={`${baseClasses} h-6 w-6 rounded`}></div>
                                <div className={`${baseClasses} h-4 w-16`}></div>
                            </div>
                            <div className="text-right space-y-1">
                                <div className={`${baseClasses} h-4 w-20`}></div>
                                <div className={`${baseClasses} h-3 w-12`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 유튜브 영상 그리드 레이아웃
    if (type === 'youtube-grid') {
        return (
            <div className={`w-full ${height} animate-pulse p-4 bg-white rounded-lg border`}>
                <div className={`${baseClasses} h-6 w-32 mb-4`}></div>
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className={`${baseClasses} h-24 w-full rounded`}></div>
                            <div className={`${baseClasses} h-4 w-full`}></div>
                            <div className={`${baseClasses} h-3 w-3/4`}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}