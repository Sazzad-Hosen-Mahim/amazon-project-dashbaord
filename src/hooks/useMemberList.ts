import { useState } from "react";
import type { User } from "@/types/user";

export const useMemberActions = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [editOpen, setEditOpen] = useState(false);
    const [newMemberOpen, setNewMemberOpen] = useState(false);
    const [addAmountOpen, setAddAmountOpen] = useState(false);
    const [decreaseAmountOpen, setDecreaseAmountOpen] = useState(false);

    // ---- Open handlers ----
    const openEdit = (user: User) => {
        setSelectedUser(user);
        setEditOpen(true);
    };

    const openNew = () => {
        setSelectedUser(null);
        setNewMemberOpen(true);
    };

    const openAddAmount = (user: User) => {
        setSelectedUser(user);
        setAddAmountOpen(true);
    };

    const openDecreaseAmount = (user: User) => {
        setSelectedUser(user);
        setDecreaseAmountOpen(true);
    };

    // ---- Close handlers ----
    const closeEdit = () => setEditOpen(false);
    const closeNew = () => setNewMemberOpen(false);
    const closeAddAmount = () => setAddAmountOpen(false);
    const closeDecreaseAmount = () => setDecreaseAmountOpen(false);

    // ---- Action handlers ----
    const handleMoreAction = (action: string, user: User) => {
        console.log(`Performing action: ${action}`, user);
    };

    return {
        // state
        selectedUser,
        editOpen,
        newMemberOpen,
        addAmountOpen,
        decreaseAmountOpen,

        // open
        openEdit,
        openNew,
        openAddAmount,
        openDecreaseAmount,

        // close
        closeEdit,
        closeNew,
        closeAddAmount,
        closeDecreaseAmount,

        // misc
        handleMoreAction,
    };
};
