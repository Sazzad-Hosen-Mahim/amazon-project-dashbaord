// src/components/dialog/ViewWithdrawalAddressDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

interface ViewWithdrawalAddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onUpdate: () => void;
}

export function ViewWithdrawalAddressDialog({
    open,
    onOpenChange,
    user,
    onUpdate,
}: ViewWithdrawalAddressDialogProps) {
    if (!user || !user.withdrawalAddressAndMethod) return null;

    const withdrawalInfo = user.withdrawalAddressAndMethod;
    const isBankTransfer = withdrawalInfo.withdrawMethod === "BankTransfer";
    // const withdrawalInfoData = withdrawalInfo.data;

    // console.log(withdrawalInfo, "99999999")



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Withdrawal Address Information</DialogTitle>
                </DialogHeader>

                {/* Card-style display for screenshot */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 space-y-4 border-2 border-blue-200 dark:border-blue-800">
                    {/* User ID */}
                    <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-blue-800">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">User ID</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{user.userId}</span>
                    </div>

                    {/* Name */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{withdrawalInfo.name}</span>
                    </div>

                    {/* Withdrawal Method */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Withdrawal Method</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {isBankTransfer ? "Bank Transfer" : "Mobile Banking"}
                        </span>
                    </div>

                    {/* Conditional fields based on withdrawal method */}
                    {isBankTransfer ? (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Bank Name</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{withdrawalInfo.bankName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Number</span>
                                <span className="font-mono font-semibold text-gray-900 dark:text-white">{withdrawalInfo.bankAccountNumber}</span>
                            </div>
                            {withdrawalInfo.branchName && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Branch Name</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{withdrawalInfo.branchName}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">District</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{withdrawalInfo.district}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Provider</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{withdrawalInfo?.mobileBankingName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mobile Number</span>
                                <span className="font-mono font-semibold text-gray-900 dark:text-white">{withdrawalInfo.mobileBankingAccountNumber}</span>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            onOpenChange(false);
                            onUpdate();
                        }}
                    >
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
