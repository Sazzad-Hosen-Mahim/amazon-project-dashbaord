// src/components/dialogs/FreezeMemberDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { User } from "@/types/user";

interface FreezeMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onConfirm: (userId: string | number, isFreeze: boolean) => void;
    isLoading: boolean;
}

export function FreezeMemberDialog({
    open,
    onOpenChange,
    user,
    onConfirm,
    isLoading,
}: FreezeMemberDialogProps) {
    if (!user) return null;

    const isCurrentlyFrozen = user.freezeUser ?? false;
    const actionText = isCurrentlyFrozen ? "Unfreeze" : "Freeze";
    const description = isCurrentlyFrozen
        ? `This will allow user ${user.userId} (${user.phoneNumber}) to login and perform actions again.`
        : `This will prevent user ${user.userId} (${user.phoneNumber}) from logging in and taking any actions.`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {actionText} Member - {user.userId}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="space-y-2 text-sm">
                        <p>
                            <strong>Phone:</strong> {user.phoneNumber}
                        </p>
                        <p>
                            <strong>Current Status:</strong>{" "}
                            <span className={isCurrentlyFrozen ? "text-red-600" : "text-green-600"}>
                                {isCurrentlyFrozen ? "Frozen" : "Active"}
                            </span>
                        </p>
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
                        variant={isCurrentlyFrozen ? "default" : "destructive"}
                        onClick={() => onConfirm(user.userId, !isCurrentlyFrozen)}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {actionText} Member
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}