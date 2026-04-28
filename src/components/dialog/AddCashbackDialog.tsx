import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface AddCashbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onConfirm: (userId: string | number, level: number) => Promise<void>;
    isLoading?: boolean;
}

const AddCashbackDialog = ({
    open,
    onOpenChange,
    user,
    onConfirm,
    isLoading = false,
}: AddCashbackDialogProps) => {
    const [amount, setAmount] = useState<string>("")
    const [error, setError] = useState<string>("")


    const handleConfirm = async () => {
        if (!user || user.userId === undefined) {
            setError("User identification not found");
            return;
        }

        if (!amount) {
            setError("Please enter cashback amount");
            return;
        }
        await onConfirm(user.userId, Number(amount));
        setAmount("");
        setError("");
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Cashback Amount</DialogTitle>
                    <DialogDescription>
                        Add cashback for user: {user?.name || user?.phoneNumber}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="level">Amount: </Label>
                        <Input
                            id="level"
                            type="number"
                            placeholder="Enter cashback amount"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setError("");
                            }}
                            min="1"
                            max="100"
                            disabled={isLoading}
                        />
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                    </div>


                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || !amount}
                    >
                        {isLoading ? "Updating..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddCashbackDialog