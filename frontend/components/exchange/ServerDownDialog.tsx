'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/shadcn-ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface IServerDownDialog {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * 서버 중단 안내 다이얼로그 컴포넌트
 * @description Production 환경에서 웹소켓 연결 실패 시 표시되는 서버 중단 안내
 */
export default function ServerDownDialog({ isOpen, onOpenChange }: IServerDownDialog) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90%] max-w-md mx-auto">
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <AlertTriangle className="w-16 h-16 text-yellow-500" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-main">
                        서버 점검 중
                    </DialogTitle>
                    <DialogDescription className="text-base text-description space-y-3">
                        <p>
                            현재 실시간 데이터 서버가 일시적으로 중단되었습니다.
                        </p>
                        <p>
                            <strong className="text-main">원인:</strong> Railway 플랜 한도 초과로 인한 서비스 중단
                        </p>
                        <p>
                            <strong className="text-main">예상 복구:</strong> 다음 달 초 (플랜 갱신 후)
                        </p>
                        <div className="p-3 bg-gray-100 rounded-md text-sm">
                            <p className="font-medium mb-1">이용 가능한 기능:</p>
                            <ul className="text-left space-y-1">
                                <li>• 코인 정보 조회</li>
                                <li>• 포트폴리오 추천</li>
                                <li>• 시장 트렌드 분석</li>
                                <li>• 내 자산 현황</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-red-50 rounded-md text-sm">
                            <p className="font-medium mb-1 text-red-700">제한된 기능:</p>
                            <ul className="text-left space-y-1 text-red-600">
                                <li>• 실시간 가격 업데이트</li>
                                <li>• 실시간 차트</li>
                                <li>• 매수/매도 주문</li>
                            </ul>
                        </div>
                        <p className="text-sm">
                            불편을 드려 죄송합니다. 빠른 시일 내에 정상 서비스로 복구하겠습니다.
                        </p>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};