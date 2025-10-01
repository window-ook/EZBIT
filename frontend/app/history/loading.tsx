import { Card, CardContent } from '@/components/shadcn-ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn-ui/table';
import { TABLE_CELL_STYLE } from '@/utils/shared/styles';

export default function Loading() {
    return (
        <main className="w-full h-full">
            <Card aria-label='거래내역 로딩'>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={`${TABLE_CELL_STYLE} font-chart-header`}>코인</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} font-chart-header`}>종류</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} font-chart-header`}>거래수량</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} font-chart-header`}>거래단가</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} font-chart-header`}>거래금액</TableHead>
                                <TableHead className={`${TABLE_CELL_STYLE} font-chart-header`}>주문시간</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index} className="text-xs">
                                    <TableCell className={TABLE_CELL_STYLE}>
                                        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                                    </TableCell>
                                    <TableCell className={TABLE_CELL_STYLE}>
                                        <div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
                                    </TableCell>
                                    <TableCell className={TABLE_CELL_STYLE}>
                                        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                                    </TableCell>
                                    <TableCell className={TABLE_CELL_STYLE}>
                                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                                    </TableCell>
                                    <TableCell className={TABLE_CELL_STYLE}>
                                        <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" />
                                    </TableCell>
                                    <TableCell className={TABLE_CELL_STYLE}>
                                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}