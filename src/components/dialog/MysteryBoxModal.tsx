import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MysteryBoxModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (method: string, amount: string) => void;
    initialMethod?: string;
    initialAmount?: string;
}

const MysteryBoxModal = ({
    isOpen,
    onClose,
    onConfirm,
    initialMethod = "",
    initialAmount = "",
}: MysteryBoxModalProps) => {
    const [method, setMethod] = useState(initialMethod);
    const [amount, setAmount] = useState(initialAmount);

    useEffect(() => {
        if (isOpen) {
            setMethod(initialMethod || "12x");
            setAmount(initialAmount || "12x");
        }
    }, [isOpen, initialMethod, initialAmount]);

    useEffect(() => {
        if (method === "12x") {
            setAmount("12x");
        } else if (method === "cash" && amount === "12x") {
            setAmount("");
        }
    }, [method]);

    const handleConfirm = () => {
        if (!method) {
            alert("Please select a method");
            return;
        }
        if (!amount) {
            alert("Please enter an amount");
            return;
        }
        onConfirm(method, amount);
        onClose();
    };

    const handleCancel = () => {
        setMethod("");
        setAmount("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-primary-dark rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Mystery Box Settings</h2>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Method</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#201f1f]"
                        >
                            <option value="">Select method</option>
                            <option value="12x">13x</option>
                            {/* <option value="cash">Cash</option> */}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Amount</label>
                        {method === "12x" ? (
                            <Input
                                value={amount}
                                disabled
                                className="bg-gray-100 dark:bg-[#201f1f]"
                            />
                        ) : (
                            <Input
                                type="text"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} className="flex-1">
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MysteryBoxModal;