// src/components/dialog/FreezeWithdrawDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/types/user";
import { useState, useEffect } from "react";

interface FreezeWithdrawDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onConfirm: (userId: string | number, freezeWithdraw: boolean) => Promise<void>;
    isLoading?: boolean;
}

export const FreezeWithdrawDialog = ({
    open,
    onOpenChange,
    user,
    onConfirm,
    isLoading = false,
}: FreezeWithdrawDialogProps) => {
    const [freezeWithdraw, setFreezeWithdraw] = useState(false);

    useEffect(() => {
        if (user) {
            setFreezeWithdraw(user.freezeWithdraw || false);
        }
    }, [user]);

    const handleConfirm = async () => {
        if (user) {
            await onConfirm(user.userId, freezeWithdraw);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Freeze Withdrawal</DialogTitle>
                    <DialogDescription>
                        Manage withdrawal restrictions for user ID: {user.userId}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="freeze-withdraw" className="text-base">
                            Freeze Withdrawal
                        </Label>
                        <Switch
                            id="freeze-withdraw"
                            checked={freezeWithdraw}
                            onCheckedChange={setFreezeWithdraw}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {freezeWithdraw ? (
                            <p className="text-destructive">
                                ⚠️ This user will be prohibited from making withdrawals.
                            </p>
                        ) : (
                            <p className="text-green-600">
                                ✓ This user will be able to make withdrawals.
                            </p>
                        )}
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
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};