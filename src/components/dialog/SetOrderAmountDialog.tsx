// src/components/dialogs/SetOrderAmountDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { User } from "@/types/user";
import { toast } from "react-toastify";

const ORDER_SLOTS = [
    8500, 30000, 50000, 100000, 200000, 300000, 500000, 1000000
] as const;

interface SetOrderAmountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onConfirm: (userId: string | number, amounts: number[]) => void;
    isLoading: boolean;
}

export function SetOrderAmountDialog({
    open,
    onOpenChange,
    user,
    onConfirm,
    isLoading,
}: SetOrderAmountDialogProps) {
    const [selectedAmounts, setSelectedAmounts] = useState<number[]>([]);
    const [customAmount, setCustomAmount] = useState("");

    // Pre-fill from user's existing userOrderAmountSlot when dialog opens
    useEffect(() => {
        if (open && user) {
            // Pre-populate from existing data
            const existingSlots = user.userOrderAmountSlot || [];
            setSelectedAmounts(existingSlots);
            setCustomAmount("");
        }
    }, [open, user]);

    const toggleSlot = (value: number) => {
        setSelectedAmounts((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const handleSubmit = () => {
        const finalAmounts = [...selectedAmounts];

        const customNum = Number(customAmount.trim());
        if (customAmount.trim() !== "" && !isNaN(customNum) && customNum > 0) {
            if (!finalAmounts.includes(customNum)) {
                finalAmounts.push(customNum);
            }
        }

        if (finalAmounts.length === 0) {
            toast("Please select at least one amount or enter a custom value.");
            return;
        }

        onConfirm(user!.userId, finalAmounts.sort((a, b) => a - b));
    };

    const displayValue = selectedAmounts.length > 0 ? selectedAmounts.join(", ") : "";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Set Order Amount – User {user?.userId}</DialogTitle>
                    <DialogDescription>
                        Select predefined slots or enter a custom amount. Multiple values can be selected.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Read-only field showing selected values */}
                    <div className="space-y-2">
                        <Label htmlFor="selected-amounts">Selected Amounts</Label>
                        <Input
                            id="selected-amounts"
                            value={displayValue}
                            readOnly
                            className="bg-muted"
                            placeholder="No amounts selected"
                        />
                    </div>

                    {/* Predefined slots */}
                    <div className="space-y-3">
                        <Label>Predefined Slots</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {ORDER_SLOTS.map((slot) => (
                                <div key={slot} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`slot-${slot}`}
                                        checked={selectedAmounts.includes(slot)}
                                        onCheckedChange={() => toggleSlot(slot)}
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor={`slot-${slot}`} className="cursor-pointer">
                                        {slot.toLocaleString()}
                                    </Label>
                                </div>
                            ))}
                        </div>
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
                        onClick={handleSubmit}
                        disabled={isLoading || (selectedAmounts.length === 0 && customAmount.trim() === "")}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Order Amounts
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}