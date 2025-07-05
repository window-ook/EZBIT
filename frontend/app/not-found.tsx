export default function NotFound() {
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="text-center p-8">
                <h1 className="text-6xl font-bold mb-4">잘못된 경로</h1>
                <p className="text-xl text-description mb-6">요청하신 페이지를 찾을 수 없습니다.</p>
            </div>
        </div>
    );
}
