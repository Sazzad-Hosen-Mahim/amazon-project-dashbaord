import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import WithdrawDetailsModal from "./WithdrawDetailsModal";
import RejectWithdrawModal from "./RejectWithdrawModal";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Withdrawal } from "@/store/rtk/api/withdrawApi";

type WithdrawTableProps = {
    data: Withdrawal[];
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    isLoading?: boolean;
};

const WithdrawTable = ({ data, page, limit, onPageChange, onLimitChange, isLoading = false }: WithdrawTableProps) => {
    const [selectedRow, setSelectedRow] = useState<Withdrawal | null>(null);
    const [openDetails, setOpenDetails] = useState(false);
    const [openReject, setOpenReject] = useState(false);

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "Successful";
            case "REJECTED":
                return "Failed";
            case "PENDING":
                return "Processing";
            default:
                return status;
        }
    };

    const totalWithdrawal = data.reduce((sum, item) => sum + (item.actualAmount || 0), 0);

    const handlePrevious = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (data.length === limit) {
            onPageChange(page + 1);
        }
    };

    const startIndex = (page - 1) * limit + 1;
    const endIndex = startIndex + data.length - 1;

    return (
        <div className="bg-white dark:bg-primary-dark rounded-lg shadow-sm overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-primary-dark/50 flex items-center justify-center z-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-primary/60 sticky top-0 z-10">
                            <TableHead className="text-center">Serial number</TableHead>
                            <TableHead>Operation</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Superior Name</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Bank / Provider</TableHead>
                            <TableHead>Account Number</TableHead>
                            <TableHead>Withdrawal Amount</TableHead>
                            <TableHead>Withdrawal Fee</TableHead>
                            <TableHead>Actual Amount</TableHead>
                            <TableHead>Total Recharge</TableHead>
                            <TableHead>Total Withdrawal</TableHead>
                            <TableHead>Application Time</TableHead>
                            <TableHead>Processing Time</TableHead>
                            <TableHead>Transaction Status</TableHead>
                            <TableHead>Review Remarks</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={16} className="text-center py-10 text-gray-500">
                                    No data
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell className="text-center">
                                        {startIndex + index}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="bg-primary text-white hover:bg-primary/80"
                                            onClick={() => {
                                                setSelectedRow(item);
                                                setOpenDetails(true);
                                            }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                    <TableCell>{item.userId}</TableCell>
                                    <TableCell>{item.superiorUserName}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.bankName || item.mobileBankingName || "-"}</TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {item.bankAccountNumber || item.mobileBankingAccountNumber || item.withdrawalAddress || "-"}
                                    </TableCell>
                                    <TableCell>৳{item.withdrawalAmount}</TableCell>
                                    <TableCell>৳{item.withdrawalFee ?? "-"}</TableCell>
                                    <TableCell>
                                        ৳{item.actualAmount ?? "-"}
                                    </TableCell>
                                    <TableCell>৳{item.totalRechargeAmount}</TableCell>
                                    <TableCell>৳{item.totalWithdrawalAmount}</TableCell>
                                    <TableCell>
                                        {format(new Date(item.applicationTime), "PP p")}
                                    </TableCell>
                                    <TableCell>
                                        {item.processingTime
                                            ? format(new Date(item.processingTime), "PP p")
                                            : "-"
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={cn(
                                                "px-3 py-1 rounded-full text-xs font-medium",
                                                item.transactionStatus === "APPROVED" &&
                                                "bg-green-100 text-green-800",
                                                item.transactionStatus === "REJECTED" &&
                                                "bg-red-100 text-red-800",
                                                item.transactionStatus === "PENDING" &&
                                                "bg-yellow-100 text-yellow-800"
                                            )}
                                        >
                                            {getStatusDisplay(item.transactionStatus)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{item.reviewRemark || "-"}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <WithdrawDetailsModal
                    open={openDetails}
                    onClose={() => setOpenDetails(false)}
                    data={selectedRow}
                    onReject={() => {
                        setOpenDetails(false);
                        setOpenReject(true);
                    }}
                />

                <RejectWithdrawModal
                    open={openReject}
                    onClose={() => setOpenReject(false)}
                    data={selectedRow}
                    onSuccess={() => {
                        setOpenReject(false);
                        setSelectedRow(null);
                    }}
                />
            </div>

            {/* Footer with Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
                <div className="text-sm text-gray-600 dark:text-white">
                    Total withdrawal amount:{" "}
                    <span className="font-bold text-red-600">৳{totalWithdrawal.toLocaleString()}</span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Rows per page:
                        </span>
                        <Select
                            value={limit.toString()}
                            onValueChange={(value) => {
                                onLimitChange(Number(value));
                                onPageChange(1); // Reset to first page when limit changes
                            }}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {data.length > 0 ? `${startIndex}-${endIndex}` : "0"}
                        </span>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePrevious}
                                disabled={page === 1}
                                className="h-8 w-8"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNext}
                                disabled={data.length < limit}
                                className="h-8 w-8"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-500">V1.0.81</div>
            </div>
        </div>
    );
};

export default WithdrawTable;