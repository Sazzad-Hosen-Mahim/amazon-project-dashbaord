// src/components/dialog/NewMemberDialog.tsx
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // assuming you're using sonner for toasts
import { useCreateMemberMutation } from "@/store/rtk/api/memberApi";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onMemberCreated?: () => void; // optional: refresh list after creation
}

const NewMemberDialog = ({ open, onOpenChange }: Props) => {
    const [createMember, { isLoading }] = useCreateMemberMutation();

    const [formData, setFormData] = useState({
        phoneNumber: "+880",
        email: "",
        password: "",
        confirmPassword: "",
        invitationCode: "adminCode", // default or from admin settings
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!formData.phoneNumber) {
            toast.error("Phone number is required");
            return;
        }
        if (!formData.password) {
            toast.error("Password is required");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!formData.invitationCode) {
            toast.error("Invitation code is required");
            return;
        }

        try {
            await createMember(formData).unwrap();
            toast.success("Member created successfully!");
            onOpenChange(false);
            // onMemberCreated?.(); // if you want to refresh the list
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create member");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Member</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new member.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phoneNumber" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+8801xxxxxxxxx"
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirmPassword" className="text-right">
                            Confirm
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="invitationCode" className="text-right">
                            Invite Code
                        </Label>
                        <Input
                            id="invitationCode"
                            name="invitationCode"
                            value={formData.invitationCode}
                            onChange={handleChange}
                            className="col-span-3"
                            required
                        />
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
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="cursor-pointer dark:text-white"
                    >
                        {isLoading ? "Creating..." : "Create Member"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewMemberDialog;