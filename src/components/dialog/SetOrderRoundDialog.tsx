// src/components/dialog/SetOrderRoundDialog.tsx
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { User } from "@/types/user";
import { toast } from "react-toastify";

interface SetOrderRoundDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onConfirm: (userId: string | number, round: "trial" | "round_one" | "round_two", status: boolean) => void;
    isLoading: boolean;
}

export function SetOrderRoundDialog({
    open,
    onOpenChange,
    user,
    onConfirm,
    isLoading,
}: SetOrderRoundDialogProps) {
    const [selectedRound, setSelectedRound] = useState<"trial" | "round_one" | "round_two">("trial");
    const [status, setStatus] = useState(true);

    // Reset when dialog opens with new user
    useEffect(() => {
        if (open && user) {
            // Pre-fill with existing values if available
            const currentRound = user.orderRound?.round || "trial";
            setSelectedRound(currentRound as "trial" | "round_one" | "round_two");
            setStatus(user.orderRound?.status ?? true);
        }
    }, [open, user]);

    const handleSubmit = () => {
        if (!selectedRound) {
            toast("Please select a round.");
            return;
        }

        onConfirm(user!.userId, selectedRound, status);
    };

    const getRoundLabel = (round: string) => {
        switch (round) {
            case "trial":
                return "Trial";
            case "round_one":
                return "Round One";
            case "round_two":
                return "Round Two";
            default:
                return round;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Set Order Round – User {user?.userId}</DialogTitle>
                    <DialogDescription>
                        Select the order round and enable/disable status for this user.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Round Selection */}
                    <div className="space-y-3">
                        <Label>Select Round</Label>
                        <RadioGroup
                            value={selectedRound}
                            onValueChange={(value: string) => setSelectedRound(value as "trial" | "round_one" | "round_two")}
                            disabled={isLoading}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="trial" id="trial" />
                                <Label htmlFor="trial" className="cursor-pointer font-normal">
                                    Trial
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="round_one" id="round_one" />
                                <Label htmlFor="round_one" className="cursor-pointer font-normal">
                                    Round One
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="round_two" id="round_two" />
                                <Label htmlFor="round_two" className="cursor-pointer font-normal">
                                    Round Two
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="status-toggle" className="cursor-pointer">
                            Enable Status
                        </Label>
                        <Switch
                            id="status-toggle"
                            checked={status}
                            onCheckedChange={setStatus}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Summary */}
                    <div className="rounded-md bg-muted p-3 text-sm">
                        <p className="font-medium mb-1">Summary:</p>
                        <p>Round: <span className="font-semibold">{getRoundLabel(selectedRound)}</span></p>
                        <p>Status: <span className="font-semibold">{status ? "Enabled" : "Disabled"}</span></p>
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
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Order Round
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
