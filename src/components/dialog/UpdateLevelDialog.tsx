import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/types/user";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateLevelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onConfirm: (userId: string | number, level: number) => Promise<void>;
    isLoading?: boolean;
}

const UpdateLevelDialog = ({
    open,
    onOpenChange,
    user,
    onConfirm,
    isLoading = false,
}: UpdateLevelDialogProps) => {
    const [level, setLevel] = useState<string>("");
    const [error, setError] = useState<string>("");

    // Reset level when user changes or dialog opens
    useEffect(() => {
        if (open && user) {
            setLevel(String(user.level || ""));
            setError("");
        }
    }, [open, user]);

    const handleConfirm = async () => {
        if (!user || user.userId === undefined) {
            setError("User identification not found");
            return;
        }

        const levelNum = Number(level);
        if (!level || isNaN(levelNum)) {
            setError("Please enter a valid numeric level");
            return;
        }
        
        if (levelNum < 1 || levelNum > 100) {
            setError("Level must be between 1 and 100");
            return;
        }

        try {
            await onConfirm(user.userId, levelNum);
            onOpenChange(false); // Close dialog on success
            setLevel("");
            setError("");
        } catch (err: any) {
            setError(err?.message || "Failed to update level");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold">Update User Level</DialogTitle>
                    <DialogDescription className="text-sm font-medium">
                        Adjust the experience level for user: <span className="text-foreground font-bold">{user?.name || user?.phoneNumber || "Unknown User"}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                        <Label htmlFor="level" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Level: {user?.level || 0}</Label>
                        <Input
                            id="level"
                            type="number"
                            placeholder="Enter new level (1-100)"
                            className="h-11 bg-muted/20 border-muted-foreground/10 focus:border-primary/50 transition-all font-bold"
                            value={level}
                            onChange={(e) => {
                                setLevel(e.target.value);
                                setError("");
                            }}
                            min="1"
                            max="100"
                            disabled={isLoading}
                        />
                        {error && (
                            <p className="text-[10px] text-destructive font-bold uppercase animate-in fade-in slide-in-from-top-1">{error}</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-3 sm:gap-0 border-t pt-6">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="font-bold"
                    >
                        CANCEL
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || !level}
                        className="font-bold px-8 shadow-lg shadow-primary/20"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? "UPDATING..." : "CONFIRM UPDATE"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Import Loader2 if needed - wait, I forgot to import Loader2
// I'll add it in the final write.

export default UpdateLevelDialog;