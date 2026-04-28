// src/components/dialog/UpdateWithdrawalAddressDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { User } from "@/types/user";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface UpdateWithdrawalAddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onConfirm: (
        userId: number,
        payload: {
            name: string;
            withdrawMethod: "BankTransfer" | "MobileBanking";
            bankName?: string;
            bankAccountNumber?: number;
            branchName?: string;
            district?: string;
            mobileBankingName?: string;
            mobileBankingAccountNumber?: number;
        }
    ) => void;
    isLoading: boolean;
}

export function UpdateWithdrawalAddressDialog({
    open,
    onOpenChange,
    user,
    onConfirm,
    isLoading,
}: UpdateWithdrawalAddressDialogProps) {
    const [name, setName] = useState("");
    const [accountType, setAccountType] = useState<"BankTransfer" | "MobileBanking" | "">("");

    // Bank Transfer fields
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [branchName, setBranchName] = useState("");
    const [districtName, setDistrictName] = useState("");

    // Mobile Banking fields
    const [provider, setProvider] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [withdrawPassword, setWithdrawPassword] = useState("");
    const [confirmWithdrawPassword, setConfirmWithdrawPassword] = useState("");
    const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
    const [showConfirmWithdrawPassword, setShowConfirmWithdrawPassword] = useState(false);

    // Initialize form with existing data
    useEffect(() => {
        if (user && user.withdrawalAddressAndMethod) {
            const withdrawalInfo = user.withdrawalAddressAndMethod;
            setName(withdrawalInfo.name || user.name || "");
            setAccountType(withdrawalInfo.withdrawMethod);

            if (withdrawalInfo.withdrawMethod === "BankTransfer") {
                setBankName(withdrawalInfo.bankName || "");
                setAccountNumber(withdrawalInfo.bankAccountNumber?.toString() || "");
                setBranchName(withdrawalInfo.branchName || "");
                setDistrictName(withdrawalInfo.district || "");
            } else if (withdrawalInfo.withdrawMethod === "MobileBanking") {
                setProvider(withdrawalInfo.mobileBankingName || "");
                setMobileNumber(withdrawalInfo.mobileBankingAccountNumber?.toString() || "");
            }
        } else if (user) {
            setName(user.name || "");
        }
    }, [user, open]);



    const handleSubmit = () => {
        if (!user || !accountType) return;

        let payload: any = {
            name,
            withdrawMethod: accountType,
        };

        if (withdrawPassword !== confirmWithdrawPassword) {
            toast.error("Withdraw Password and Confirm Withdraw Password do not match");
            return;
        }

        if (accountType === "BankTransfer") {
            payload = {
                ...payload,
                bankName,
                bankAccountNumber: Number(accountNumber),
                district: districtName,
            };

            if (branchName) {
                payload.branchName = branchName;
            }
        } else if (accountType === "MobileBanking") {
            payload = {
                ...payload,
                mobileBankingName: provider,
                mobileBankingAccountNumber: Number(mobileNumber),
                mobileUserDistrict: districtName,
                withdrawPassword,
            };
        }

        onConfirm(user.userId, payload);
    };

    const isFormValid = () => {
        if (!name || !accountType) return false;

        if (accountType === "BankTransfer") {
            return bankName && accountNumber && districtName;
        } else if (accountType === "MobileBanking") {
            return provider && mobileNumber;
        }

        return false;
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Withdrawal Address - User {user.userId}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name *</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Account Type Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Withdrawal Method *</label>
                        <select
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value as "BankTransfer" | "MobileBanking")}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Withdrawal Method</option>
                            <option value="BankTransfer">Bank Transfer</option>
                            <option value="MobileBanking">Mobile Banking</option>
                        </select>
                    </div>

                    {/* Bank Transfer Fields */}
                    {accountType === "BankTransfer" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bank Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., DBBL, City Bank"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Account Number *</label>
                                <input
                                    type="text"
                                    placeholder="Enter account number"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Branch Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Dhanmondi"
                                    value={branchName}
                                    onChange={(e) => setBranchName(e.target.value)}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">District *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Dhaka, Chittagong"
                                    value={districtName}
                                    onChange={(e) => setDistrictName(e.target.value)}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {/* Mobile Banking Fields */}
                    {accountType === "MobileBanking" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Provider *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., bKash, Nagad, Rocket"
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mobile Number *</label>
                                <input
                                    type="tel"
                                    placeholder="Enter mobile number"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">District *</label>
                                <input
                                    type="text"
                                    placeholder="Enter district"
                                    value={districtName}
                                    onChange={(e) => setDistrictName(e.target.value)}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1">Withdraw Password</label>
                        <input
                            type={showWithdrawPassword ? "text" : "password"}
                            placeholder="Enter withdraw password"
                            value={withdrawPassword}
                            onChange={(e) => setWithdrawPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowWithdrawPassword(!showWithdrawPassword)}
                            className="absolute right-2 top-2/3 transform -translate-y-1/2"
                        >
                            {showWithdrawPassword ? <Eye /> : <EyeOff />}
                        </button>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1">Confirm Withdraw Password</label>
                        <input
                            type={showConfirmWithdrawPassword ? "text" : "password"}
                            placeholder="Enter withdraw password"
                            value={confirmWithdrawPassword}
                            onChange={(e) => setConfirmWithdrawPassword(e.target.value)}
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmWithdrawPassword(!showConfirmWithdrawPassword)}
                            className="absolute right-2 top-2/3 transform -translate-y-1/2"
                        >
                            {showConfirmWithdrawPassword ? <Eye /> : <EyeOff />}
                        </button>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading || !isFormValid()}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Address
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
