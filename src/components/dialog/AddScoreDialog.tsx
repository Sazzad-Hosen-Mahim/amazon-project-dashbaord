// src/components/dialog/AddScoreDialog.tsx
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
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import type { User } from "@/types/user";

interface AddScoreDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onConfirm: (userId: string | number, score: number) => Promise<void>;
    isLoading?: boolean;
}

export const AddScoreDialog = ({
    open,
    onOpenChange,
    user,
    onConfirm,
    isLoading = false,
}: AddScoreDialogProps) => {
    const [score, setScore] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (open) {
            setScore("");
            setError("");
        }
    }, [open]);

    const handleConfirm = async () => {
        if (!user) return;

        const scoreValue = Number(score);

        if (!score || isNaN(scoreValue)) {
            setError("Please enter a valid score");
            return;
        }

        if (scoreValue <= 0) {
            setError("Score must be greater than 0");
            return;
        }

        if (scoreValue > 100) {
            setError("Score cannot exceed 100");
            return;
        }

        try {
            await onConfirm(user.userId, scoreValue);
            onOpenChange(false);
        } catch (err) {
            // Error handling is done in parent component
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Score Amount</DialogTitle>
                    <DialogDescription>
                        Add score for user: {user?.name || user?.phoneNumber}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="score">Score Amount</Label>
                        <Input
                            id="score"
                            type="number"
                            placeholder="Enter score amount (1-100)"
                            value={score}
                            onChange={(e) => {
                                setScore(e.target.value);
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
                        disabled={isLoading || !score}
                    >
                        {isLoading ? "Adding..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};