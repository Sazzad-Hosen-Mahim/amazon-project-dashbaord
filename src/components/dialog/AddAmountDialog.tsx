import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddAmountMutation } from "@/store/rtk/api/memberApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    userId?: string | number;
}

const AddAmountDialog = ({ open, onOpenChange, onConfirm, userId }: Props) => {
    const [amount, setAmount] = useState("");
    const [addAmount, { isLoading }] = useAddAmountMutation();
    // soner toast 

    const handleSubmit = async () => {
        if (!userId) {
            toast.error("User ID is required");
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        try {
            const result = await addAmount({
                userId: userId.toString(),
                amount: parseFloat(amount),
            }).unwrap();

            toast.success(result.message || "Amount added successfully");

            setAmount("");
            onConfirm();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add amount");
        }
    };

    const handleClose = () => {
        setAmount("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add amount</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Amount</Label>
                        <Input
                            type="number"
                            className="col-span-3"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="0"
                            step="0.01"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        OK
                    </Button>
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddAmountDialog;