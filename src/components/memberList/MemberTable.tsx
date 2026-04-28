import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pencil,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types/user";
import { useState, useRef } from "react";
import {
    useFreezeUserMutation,
    useUpdateOrderAmountSlotMutation,
    useUpdateOrderRoundMutation,
    useUpdateScoreMutation,
    useFreezeWithdrawMutation,
    useUpdateLevelMutation,
    useAddCashbackMutation
} from "@/store/rtk/api/memberApi";
import { toast } from "react-toastify";
import { FreezeMemberDialog } from "../dialog/FreezeMemberDialog";
import { SetOrderAmountDialog } from "../dialog/SetOrderAmountDialog";
import { SetOrderRoundDialog } from "../dialog/SetOrderRoundDialog";
import { AddScoreDialog } from "../dialog/AddScoreDialog";
import { FreezeWithdrawDialog } from "../dialog/FreezeWithdrawDialog";
import { ViewWithdrawalAddressDialog } from "../dialog/ViewWithdrawalAddressDialog";
import { UpdateWithdrawalAddressDialog } from "../dialog/UpdateWithdrawalAddressDialog";
import { UpdatePasswordDialog } from "../dialog/UpdatePasswordDialog";
import { useUpdateWithdrawalAddressMutation } from "@/store/rtk/api/withdrawApi";
import { useUpdatePasswordFromAdminMutation } from "@/store/rtk/api/memberApi";
import UpdateLevelDialog from "../dialog/UpdateLevelDialog";
import AddCashbackDialog from "../dialog/AddCashbackDialog";

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
}

interface MemberTableProps {
    data: User[];
    onAddAmount: (user: User) => void;
    onDecreaseAmount: (user: User) => void;
    onMoreAction: (action: string, user: User) => void;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (limit: number) => void;
    isLoading?: boolean;
}

const MemberTable = ({
    data,
    onAddAmount,
    onDecreaseAmount,
    pagination,
    onPageChange,
    onPageSizeChange,
    isLoading = false,
}: MemberTableProps) => {
    const [openDropdownUserId, setOpenDropdownUserId] = useState<string | number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
    const dropdownButtonRef = useRef<HTMLButtonElement>(null);
    const [selectedUserForFreeze, setSelectedUserForFreeze] = useState<User | null>(null);
    const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
    const [selectedUserForOrderAmount, setSelectedUserForOrderAmount] = useState<User | null>(null);
    const [orderAmountDialogOpen, setOrderAmountDialogOpen] = useState(false);
    const [selectedUserForOrderRound, setSelectedUserForOrderRound] = useState<User | null>(null);
    const [orderRoundDialogOpen, setOrderRoundDialogOpen] = useState(false);
    const [selectedUserForScore, setSelectedUserForScore] = useState<User | null>(null);
    const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
    const [selectedUserForFreezeWithdraw, setSelectedUserForFreezeWithdraw] = useState<User | null>(null);
    const [freezeWithdrawDialogOpen, setFreezeWithdrawDialogOpen] = useState(false);
    const [selectedUserForWithdrawalView, setSelectedUserForWithdrawalView] = useState<User | null>(null);
    const [viewWithdrawalDialogOpen, setViewWithdrawalDialogOpen] = useState(false);
    const [updateWithdrawalDialogOpen, setUpdateWithdrawalDialogOpen] = useState(false);
    const [selectedUserForPassword, setSelectedUserForPassword] = useState<User | null>(null);
    const [updatePasswordDialogOpen, setUpdatePasswordDialogOpen] = useState(false);
    const [selectedUserForLevel, setSelectedUserForLevel] = useState<User | null>(null);
    const [updateLevelDialogOpen, setUpdateLevelDialogOpen] = useState(false);
    const [addCashbackDialogOpen, setAddCashbackDialogOpen] = useState(false);
    const [selectedUserForCashback, setSelectedUserForCashback] = useState<User | null>(null);

    const [updateScore, { isLoading: isUpdatingScore }] = useUpdateScoreMutation();
    const [updateOrderAmount, { isLoading: isUpdatingOrderAmount }] = useUpdateOrderAmountSlotMutation();
    const [freezeUser, { isLoading: isFreezing }] = useFreezeUserMutation();
    const [updateOrderRound, { isLoading: isUpdatingRound }] = useUpdateOrderRoundMutation();
    const [freezeWithdraw, { isLoading: isFreezingWithdraw }] = useFreezeWithdrawMutation();
    const [updateWithdrawalAddress, { isLoading: isUpdatingWithdrawalAddress }] = useUpdateWithdrawalAddressMutation();
    const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordFromAdminMutation();
    const [updateLevel, { isLoading: isUpdatingLevel }] = useUpdateLevelMutation();
    const [addCashback, { isLoading: isAddingCashback }] = useAddCashbackMutation();

    const closeDropdown = () => setOpenDropdownUserId(null);

    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    const handlePageSizeChange = (value: string) => {
        const newLimit = Number(value);
        if (onPageSizeChange) {
            onPageSizeChange(newLimit);
            if (onPageChange) {
                onPageChange(1);
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        if (onPageChange && pagination) {
            if (newPage >= 1 && newPage <= pagination.totalPages) {
                onPageChange(newPage);
            }
        }
    };

    const getPageNumbers = () => {
        if (!pagination) return [];

        const { currentPage, totalPages } = pagination;
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                endPage = Math.min(5, totalPages - 1);
            } else if (currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - 4);
            }

            if (startPage > 2) {
                pages.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handleFreezeAction = async (userId: string | number, isFreeze: boolean) => {
        try {
            await freezeUser({
                userId,
                payload: { isFreeze },
            }).unwrap();

            toast.success("Member freeze status updated successfully.");

            setFreezeDialogOpen(false);
            setSelectedUserForFreeze(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update freeze status");
        }
    };

    const handleSetOrderAmount = async (userId: string | number, amounts: number[]) => {
        try {
            await updateOrderAmount({
                userId,
                payload: { amount: amounts },
            }).unwrap();

            toast.success("Order amounts updated successfully.")

            setOrderAmountDialogOpen(false);
            setSelectedUserForOrderAmount(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update order amounts")
        }
    };

    const handleSetOrderRound = async (userId: string | number, round: "trial" | "round_one" | "round_two", status: boolean) => {
        try {
            await updateOrderRound({
                userId,
                payload: { round, status },
            }).unwrap();

            toast.success(`Order round updated to ${round} with status ${status ? "enabled" : "disabled"}`);

            setOrderRoundDialogOpen(false);
            setSelectedUserForOrderRound(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update order round");
        }
    };

    const handleDropdownToggle = (userId: string | number, buttonRef: HTMLButtonElement | null) => {
        if (openDropdownUserId === userId) {
            setOpenDropdownUserId(null);
        } else {
            setOpenDropdownUserId(userId);

            if (buttonRef) {
                const rect = buttonRef.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY + 8,
                    right: window.innerWidth - rect.right + window.scrollX
                });
            }
        }
    };

    const handleUpdateScore = async (userId: string | number, score: number) => {
        try {
            await updateScore({
                userId,
                payload: { score },
            }).unwrap();

            toast.success("Score updated successfully.");

            setScoreDialogOpen(false);
            setSelectedUserForScore(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update score");
        }
    };

    const handleFreezeWithdraw = async (userId: string | number, freezeWithdrawStatus: boolean) => {
        try {
            await freezeWithdraw({
                userId,
                payload: { freezeWithdraw: freezeWithdrawStatus },
            }).unwrap();

            toast.success(`Withdrawal ${freezeWithdrawStatus ? "frozen" : "unfrozen"} successfully.`);

            setFreezeWithdrawDialogOpen(false);
            setSelectedUserForFreezeWithdraw(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update withdrawal status");
        }
    };

    const handleUpdateWithdrawalAddress = async (
        userId: number,
        payload: {
            name: string;
            withdrawMethod: "BankTransfer" | "MobileBanking";
            bankName?: string;
            bankAccountNumber?: number;
            branchName?: string;
            district?: string;
            mobileBankingName?: string;
            mobileBankingAccountNumber?: number;
        }
    ) => {
        try {
            await updateWithdrawalAddress({
                userId,
                payload,
            }).unwrap();

            toast.success("Withdrawal address updated successfully.");

            setUpdateWithdrawalDialogOpen(false);
            setSelectedUserForWithdrawalView(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update withdrawal address");
        }
    };

    const handleUpdatePassword = async (userId: string | number, newPassword: string) => {
        // console.log("handleUpdatePassword in MemberTable", { userId, newPasswordLength: newPassword.length });
        try {
            const result = await updatePassword({
                userId,
                payload: { newPassword },
            }).unwrap();
            console.log("Password update success:", result);

            toast.success("Password updated successfully.");

            setUpdatePasswordDialogOpen(false);
            setSelectedUserForPassword(null);
        } catch (err: any) {
            console.error("Password update error:", err);
            toast.error(err?.data?.message || "Failed to update password");
        }
    };

    const handleUpdateLevel = async (userId: string | number, newLevel: number) => {
        try {
            const result = await updateLevel({
                userId,
                payload: { level: newLevel },
            }).unwrap();
            console.log("Level update success:", result);

            toast.success("Level updated successfully.");

            setUpdateLevelDialogOpen(false);
            setSelectedUserForLevel(null);
        } catch (err: any) {
            console.error("Level update error:", err);
            toast.error(err?.data?.message || "Failed to update level");
        }
    };

    const handleAddCashback = async (userId: string | number, amount: number) => {
        try {
            const result = await addCashback({
                userId,
                payload: { cashbackAmount: amount },
            }).unwrap();
            console.log("Cashback added successfully:", result);

            toast.success("Cashback added successfully.");

            setAddCashbackDialogOpen(false);
            setSelectedUserForCashback(null);
        } catch (err: any) {
            console.error("Cashback addition error:", err);
            toast.error(err?.data?.message || "Failed to add cashback");
        }
    };

    const startIndex = pagination ? (pagination.currentPage - 1) * pagination.limit : 0;

    const formatMoney = (amount: number) =>
        Number(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    return (
        <div className="space-y-4">
            {/* Table Container with minimum height */}
            <div className="border rounded-md" style={{ minHeight: '500px' }}>
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="sticky top-0 z-10 bg-gray-200 dark:bg-primary/60">
                            <TableRow className="text-center">
                                <TableHead>Serial Number</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Mobile Phone Number</TableHead>
                                <TableHead>Invitation Code</TableHead>
                                <TableHead>Superior ID</TableHead>
                                <TableHead>Superior Name</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Operation</TableHead>
                                <TableHead>User Level</TableHead>
                                <TableHead>Quantity of Orders</TableHead>
                                <TableHead>Completed Orders</TableHead>
                                <TableHead>Out of Balance</TableHead>
                                <TableHead>Shot Assigned</TableHead>
                                <TableHead>Actual Completed Today</TableHead>
                                <TableHead>User Balance</TableHead>
                                <TableHead>Total Recharge</TableHead>
                                <TableHead>Total Withdrawal</TableHead>
                                <TableHead>Order Freezing Amount</TableHead>
                                <TableHead>Frozen Withdrawal Amount</TableHead>
                                <TableHead>Online Status</TableHead>
                                <TableHead>Freeze Status</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Ip Address</TableHead>
                                <TableHead>Registration Time</TableHead>
                                <TableHead>User Type</TableHead>
                                <TableHead>Deposit Type</TableHead>
                                <TableHead>Selected Package</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={24} className="text-center py-8 text-gray-500">
                                        {isLoading ? "Loading..." : "No members found"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((user, index) => (
                                    <TableRow key={user.userId}>
                                        <TableCell>
                                            {startIndex + index + 1}
                                        </TableCell>
                                        <TableCell>{user.userId}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>{user.invitationCode}</TableCell>
                                        <TableCell>{user.superiorUserId}</TableCell>
                                        <TableCell>{user.superiorUserName}</TableCell>
                                        <TableCell className="text-center font-bold text-blue-400">{user.level}</TableCell>

                                        <TableCell>
                                            <div className="flex space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedUserForWithdrawalView(user);
                                                        setViewWithdrawalDialogOpen(true);
                                                    }}
                                                    disabled={!user.withdrawalAddressAndMethod}
                                                    title={user.withdrawalAddressAndMethod ? "View withdrawal address" : "No withdrawal address set"}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    className="bg-blue-900 cursor-pointer hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600"
                                                    size="sm"
                                                    onClick={() => navigate(`/collection-setting/${user.userId}`)}
                                                >
                                                    Collection settings
                                                </Button>

                                                <Button
                                                    className="bg-teal-600 cursor-pointer hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-600"
                                                    size="sm"
                                                    onClick={() => onAddAmount(user)}
                                                >
                                                    Add amount
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => onDecreaseAmount(user)}
                                                    className="cursor-pointer"
                                                >
                                                    Decrease amount
                                                </Button>

                                                {/* Dropdown with proper positioning */}
                                                <div className="relative">
                                                    <Button
                                                        ref={openDropdownUserId === user.userId ? dropdownButtonRef : null}
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            handleDropdownToggle(user.userId, e.currentTarget);
                                                        }}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedUserForOrderRound(user);
                                                    setOrderRoundDialogOpen(true);
                                                }}
                                                disabled={isUpdatingRound || isLoading}
                                                className="w-[140px] h-8 text-sm"
                                            >
                                                {user.orderRound?.round ? (
                                                    <span>
                                                        {user.orderRound.round === "trial" && "Trial"}
                                                        {user.orderRound.round === "round_one" && "Round One"}
                                                        {user.orderRound.round === "round_two" && "Round Two"}
                                                        {user.orderRound.status ? " ✓" : " ✗"}
                                                    </span>
                                                ) : (
                                                    "Set Round"
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{user?.quantityOfOrders}</TableCell>
                                        <TableCell>{user?.completedOrdersCount}</TableCell>
                                        <TableCell className={` ${user?.outOfBalance > 0 ? "text-red-500" : "text-green-500"}`}>{formatMoney(user?.outOfBalance)}</TableCell>
                                        <TableCell className={`text-center ${user?.adminAssaignProductsOrRewards && user?.adminAssaignProductsOrRewards?.length > 0 ? "text-indigo-700" : "text-orange-700"}`}>{user?.adminAssaignProductsOrRewards && user?.adminAssaignProductsOrRewards?.length}</TableCell>
                                        <TableCell>{user?.actualCompletedNumberToday}</TableCell>
                                        <TableCell>{formatMoney(user?.userBalance)}</TableCell>
                                        <TableCell>{formatMoney(user?.memberTotalRecharge)}</TableCell>
                                        <TableCell>{formatMoney(user?.memberTotalWithdrawal)}</TableCell>
                                        <TableCell>{user?.userOrderFreezingAmount?.toLocaleString()}</TableCell>
                                        <TableCell>{user?.amountFrozedInWithdrawal?.toLocaleString()}</TableCell>
                                        <TableCell>{user?.isOnline ? <span className="text-green-500">🟢 Online</span> : <span className="text-red-500">🔴 Offline</span>}</TableCell>
                                        <TableCell>{user?.freezeUser ? "Frozen" : "Active"}</TableCell>
                                        <TableCell>{user?.email || "N/A"}</TableCell>
                                        <TableCell>{user?.lastLoginIp || "N/A"}</TableCell>
                                        <TableCell>{formatDate(user?.createdAt)}</TableCell>
                                        <TableCell>{user?.userType}</TableCell>
                                        <TableCell>{user?.userDiopsitType}</TableCell>
                                        <TableCell>{user?.userSelectedPackage?.toLocaleString() || "N/A"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Dropdown Portal - Rendered outside table */}
            {openDropdownUserId !== null && (
                <>
                    {/* Click outside overlay */}
                    <div
                        className="fixed inset-0 z-[9998]"
                        onClick={closeDropdown}
                    />

                    {/* Dropdown menu with calculated position */}
                    <div
                        className="fixed w-52 rounded-md border bg-background shadow-lg z-[9999]"
                        style={{
                            top: `${dropdownPosition.top}px`,
                            right: `${dropdownPosition.right}px`
                        }}
                    >
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-t-md"
                            onClick={() => {
                                closeDropdown();
                                const user = data.find(u => u.userId === openDropdownUserId);
                                if (user) {
                                    setSelectedUserForFreeze(user);
                                    setFreezeDialogOpen(true);
                                }
                            }}
                        >
                            {data.find(u => u.userId === openDropdownUserId)?.freezeUser ? "Unfreeze Member" : "Freeze Member"}
                        </button>

                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => {
                                closeDropdown();
                                const user = data.find(u => u.userId === openDropdownUserId);
                                if (user) {
                                    setSelectedUserForFreezeWithdraw(user);
                                    setFreezeWithdrawDialogOpen(true);
                                }
                            }}
                        >
                            Withdrawal prohibited
                        </button>

                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => {
                                closeDropdown();
                                const user = data.find(u => u.userId === openDropdownUserId);
                                if (user) {
                                    setSelectedUserForScore(user);
                                    setScoreDialogOpen(true);
                                }
                            }}
                        >
                            Add Score Amount
                        </button>

                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-b-md"
                            onClick={() => {
                                closeDropdown();
                                const user = data.find(u => u.userId === openDropdownUserId);
                                if (user) {
                                    setSelectedUserForOrderAmount(user);
                                    setOrderAmountDialogOpen(true);
                                }
                            }}
                        >
                            Set the user order amount
                        </button>
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-b-md"
                            onClick={() => {
                                closeDropdown();
                                const user = data.find(u => u.userId === openDropdownUserId);
                                if (user) {
                                    setSelectedUserForPassword(user);
                                    setUpdatePasswordDialogOpen(true);
                                }
                            }}
                        >
                            Change Password
                        </button>
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-b-md"
                            onClick={() => {
                                closeDropdown();
                                const user = data.find(u => u.userId === openDropdownUserId);
                                if (user) {
                                    setSelectedUserForLevel(user);
                                    setUpdateLevelDialogOpen(true);
                                }
                            }}
                        >
                            Update Level
                        </button>
                        <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-b-md"
                            onClick={() => {
                                closeDropdown();
                                const user = data.find(u => u.userId === openDropdownUserId);
                                if (user) {
                                    setSelectedUserForCashback(user);
                                    setAddCashbackDialogOpen(true);
                                }
                            }}
                        >
                            Add Cashback Amount
                        </button>
                    </div>
                </>
            )}

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            Showing{" "}
                            {pagination.totalItems === 0
                                ? 0
                                : startIndex + 1
                            } to{" "}
                            {Math.min(startIndex + pagination.limit, pagination.totalItems)} of{" "}
                            {pagination.totalItems} entries
                        </div>

                        <Select
                            value={pagination.limit.toString()}
                            onValueChange={handlePageSizeChange}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="20">20 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                                <SelectItem value="100">100 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(1)}
                            disabled={pagination.currentPage === 1 || isLoading}
                            title="First page"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1 || isLoading}
                            title="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, idx) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                                        ...
                                    </span>
                                ) : (
                                    <Button
                                        key={page}
                                        variant={pagination.currentPage === page ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => handlePageChange(page as number)}
                                        disabled={isLoading}
                                        className="w-10"
                                    >
                                        {page}
                                    </Button>
                                )
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.totalPages || isLoading}
                            title="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(pagination.totalPages)}
                            disabled={pagination.currentPage >= pagination.totalPages || isLoading}
                            title="Last page"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <FreezeMemberDialog
                open={freezeDialogOpen}
                onOpenChange={setFreezeDialogOpen}
                user={selectedUserForFreeze}
                onConfirm={handleFreezeAction}
                isLoading={isFreezing}
            />
            <SetOrderAmountDialog
                open={orderAmountDialogOpen}
                onOpenChange={setOrderAmountDialogOpen}
                user={selectedUserForOrderAmount}
                onConfirm={handleSetOrderAmount}
                isLoading={isUpdatingOrderAmount}
            />
            <SetOrderRoundDialog
                open={orderRoundDialogOpen}
                onOpenChange={setOrderRoundDialogOpen}
                user={selectedUserForOrderRound}
                onConfirm={handleSetOrderRound}
                isLoading={isUpdatingRound}
            />
            <AddScoreDialog
                open={scoreDialogOpen}
                onOpenChange={setScoreDialogOpen}
                user={selectedUserForScore}
                onConfirm={handleUpdateScore}
                isLoading={isUpdatingScore}
            />
            <FreezeWithdrawDialog
                open={freezeWithdrawDialogOpen}
                onOpenChange={setFreezeWithdrawDialogOpen}
                user={selectedUserForFreezeWithdraw}
                onConfirm={handleFreezeWithdraw}
                isLoading={isFreezingWithdraw}
            />
            <ViewWithdrawalAddressDialog
                open={viewWithdrawalDialogOpen}
                onOpenChange={setViewWithdrawalDialogOpen}
                user={selectedUserForWithdrawalView}
                onUpdate={() => {
                    setUpdateWithdrawalDialogOpen(true);
                }}
            />
            <UpdateWithdrawalAddressDialog
                open={updateWithdrawalDialogOpen}
                onOpenChange={setUpdateWithdrawalDialogOpen}
                user={selectedUserForWithdrawalView}
                onConfirm={handleUpdateWithdrawalAddress}
                isLoading={isUpdatingWithdrawalAddress}
            />
            <UpdatePasswordDialog
                open={updatePasswordDialogOpen}
                onOpenChange={setUpdatePasswordDialogOpen}
                user={selectedUserForPassword}
                onConfirm={handleUpdatePassword}
                isLoading={isUpdatingPassword}
            />
            <UpdateLevelDialog
                open={updateLevelDialogOpen}
                onOpenChange={setUpdateLevelDialogOpen}
                user={selectedUserForLevel}
                onConfirm={handleUpdateLevel}
                isLoading={isUpdatingLevel}
            />
            <AddCashbackDialog
                open={addCashbackDialogOpen}
                onOpenChange={setAddCashbackDialogOpen}
                user={selectedUserForCashback}
                onConfirm={handleAddCashback}
                isLoading={isAddingCashback}
            />
        </div>
    );
};

export default MemberTable;