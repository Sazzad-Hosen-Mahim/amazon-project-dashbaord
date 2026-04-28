import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRejectWithdrawMutation, type Withdrawal } from "@/store/rtk/api/withdrawApi";
import { toast } from "react-toastify";

type RejectWithdrawModalProps = {
    open: boolean;
    onClose: () => void;
    data: Withdrawal | null;
    onSuccess: () => void;
};

const RejectWithdrawModal = ({
    open,
    onClose,
    data,
    onSuccess,
}: RejectWithdrawModalProps) => {
    const [remark, setRemark] = useState("");
    const [rejectWithdraw, { isLoading }] = useRejectWithdrawMutation();

    const handleSubmit = async () => {
        if (!data) return;

        if (!remark.trim()) {
            toast("Please enter a rejection remark");
            return;
        }

        try {
            await rejectWithdraw({
                id: data._id,
                payload: {
                    reviewRemark: remark,
                },
            }).unwrap();

            toast("Withdrawal rejected successfully!");
            setRemark("");
            onSuccess();
        } catch (error) {
            console.error("Failed to reject withdrawal:", error);
            toast("Failed to reject withdrawal. Please try again.");
        }
    };

    const handleClose = () => {
        setRemark("");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Reject Withdrawal</DialogTitle>
                </DialogHeader>

                {data && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-primary-dark rounded-md">
                        <p className="text-sm text-white">
                            Amount: ৳{data.actualAmount}
                        </p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Rejection Remark <span className="text-red-500">*</span>
                    </label>
                    <Input
                        placeholder="Enter rejection remark"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RejectWithdrawModal;