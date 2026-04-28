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
import { useState } from "react";
import { useDecreaseAmountMutation } from "@/store/rtk/api/memberApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    userId?: string | number;
}

const DecreaseAmountDialog = ({ open, onOpenChange, onConfirm, userId }: Props) => {
    const [amount, setAmount] = useState("");
    const [decreaseAmount, { isLoading }] = useDecreaseAmountMutation();

    // console.log(amount, "madafak")

    const handleSubmit = async () => {
        if (!userId) {
            toast.error("User ID is required");
            return;
        }
        // console.log(amount, "madafak")

        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        try {
            const result = await decreaseAmount({
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
        <Dialog open={open} onOpenChange={handleClose} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Decrease amount</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Amount</Label>
                        <Input className="col-span-3" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>{isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Change</Button>
                    <Button variant="outline" onClick={() => handleClose()}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DecreaseAmountDialog;
