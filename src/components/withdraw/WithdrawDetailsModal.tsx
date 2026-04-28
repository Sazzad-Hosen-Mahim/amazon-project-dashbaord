import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
    type Withdrawal,
    useGetSingleUserWithdrawsQuery,
    useAcceptWithdrawMutation
} from "@/store/rtk/api/withdrawApi";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

type WithdrawDetailsModalProps = {
    open: boolean;
    onClose: () => void;
    data: Withdrawal | null;
    onReject: () => void;
};

const DetailRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex justify-between  py-2 text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium">{value ?? "-"}</span>
    </div>
);

const WithdrawDetailsModal = ({
    open,
    onClose,
    data,
    onReject,
}: WithdrawDetailsModalProps) => {
    const [latestWithdrawal, setLatestWithdrawal] = useState<Withdrawal | null>(null);

    // console.log(data?._id, "iddddd n withdtraw")

    // Fetch user's withdrawals when modal opens
    const { data: userWithdraws, isLoading } = useGetSingleUserWithdrawsQuery(
        data?._id || "",
        {
            skip: !data?._id || !open,
        }
    );

    const [acceptWithdraw, { isLoading: isAccepting }] = useAcceptWithdrawMutation();

    useEffect(() => {
        if (userWithdraws?.data) {
            setLatestWithdrawal(userWithdraws.data);
        }
    }, [userWithdraws]);

    console.log(latestWithdrawal, "latestWithdrawal")

    const handleAccept = async () => {
        if (!latestWithdrawal) return;

        try {
            await acceptWithdraw({
                id: latestWithdrawal._id,
                payload: {
                    userId: latestWithdrawal.userId,
                    amount: latestWithdrawal.amount,
                },
            }).unwrap();

            toast("Withdrawal accepted successfully!");
            onClose();
        } catch (error) {
            console.error("Failed to accept withdrawal:", error);
            toast("Failed to accept withdrawal. Please try again.");
        }
    };

    if (!data) return null;

    const displayData = latestWithdrawal || data;
    const isPending = displayData.transactionStatus === "PENDING";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Withdraw Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="ml-2">Loading details...</span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {/* Card 1: Transaction Overview */}
                            <div className="border rounded-lg p-4 space-y-2 shadow-sm bg-blue-100 dark:bg-secondary">
                                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2 dark:text-white">Transaction Info</h3>
                                <DetailRow label="User ID" value={displayData.userId} />
                                <DetailRow label="Amount" value={`৳${displayData.amount}`} />
                                <DetailRow
                                    label="Status"
                                    value={
                                        <span className={
                                            displayData.transactionStatus === "APPROVED"
                                                ? "text-green-600"
                                                : displayData.transactionStatus === "REJECTED"
                                                    ? "text-red-600"
                                                    : "text-yellow-600"
                                        }>
                                            {displayData.transactionStatus}
                                        </span>
                                    }
                                />
                                <DetailRow
                                    label="Withdrawal Amount"
                                    value={`৳${displayData.withdrawalAmount}`}
                                />
                                <DetailRow
                                    label="Total Recharge"
                                    value={`৳${displayData.totalRechargeAmount}`}
                                />
                                <DetailRow
                                    label="Total Withdrawal"
                                    value={`৳${displayData.totalWithdrawalAmount}`}
                                />
                                <DetailRow
                                    label="Application Time"
                                    value={format(new Date(displayData.applicationTime), "PPpp")}
                                />
                                {displayData.processingTime && (
                                    <DetailRow
                                        label="Processing Time"
                                        value={format(new Date(displayData.processingTime), "PPpp")}
                                    />
                                )}
                            </div>

                            {/* Card 2: Method Details */}
                            <div className="border rounded-lg p-4 space-y-2 shadow-sm bg-blue-100  dark:bg-secondary">
                                <h3 className="font-semibold text-gray-700 border-b pb-2 mb-2 dark:text-white">
                                    Method: {displayData.withdrawMethod}
                                </h3>

                                {displayData.withdrawMethod === "BankTransfer" ? (
                                    <>
                                        <DetailRow label="Bank Name" value={displayData.bankName} />
                                        <DetailRow label="Account Number" value={displayData.bankAccountNumber} />
                                        <DetailRow label="Branch Name" value={displayData.branchName} />
                                        <DetailRow label="District" value={displayData.district} />
                                    </>
                                ) : (
                                    <>
                                        <DetailRow label="Provider" value={displayData.mobileBankingName} />
                                        <DetailRow label="Account Number" value={displayData.mobileBankingAccountNumber} />
                                        <DetailRow label="District" value={displayData.mobileUserDistrict} />
                                    </>
                                )}

                                {/* Common extra fields if any */}
                                <DetailRow label="Name" value={displayData.name} />
                                <DetailRow
                                    label="Review Remark"
                                    value={displayData.reviewRemark}
                                />
                            </div>
                        </div>

                        {/* Actions - only show if status is PENDING */}
                        {isPending && (
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={onReject}>
                                    Reject
                                </Button>
                                <Button
                                    className="bg-teal-600 cursor-pointer hover:bg-teal-700"
                                    onClick={handleAccept}
                                    disabled={isAccepting}
                                >
                                    {isAccepting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Accepting...
                                        </>
                                    ) : (
                                        "Accept"
                                    )}
                                </Button>
                            </div>
                        )}

                        {!isPending && (
                            <div className="pt-4 text-sm text-gray-500 text-center">
                                This withdrawal has already been {displayData.transactionStatus.toLowerCase()}
                            </div>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default WithdrawDetailsModal;