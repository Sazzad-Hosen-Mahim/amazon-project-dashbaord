// import { useMemo } from "react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Pencil, MoreHorizontal } from "lucide-react";
// import type { User } from "@/types/user";
// import type { ColumnConfig } from "@/types/memberList/memberType";

// interface MembersTableProps {
//     data: User[];
//     columns?: ColumnConfig[];
//     onEditUser: (user: User) => void;
//     onNavigateToCollection: (user: User) => void;
//     onAddAmount: (user: User) => void;
//     onDecreaseAmount: (user: User) => void;
//     onMoreAction: (action: string, user: User) => void;
// }

// const MembersTable = ({
//     data,
//     columns,
//     onEditUser,
//     onNavigateToCollection,
//     onAddAmount,
//     onDecreaseAmount,
//     onMoreAction,
// }: MembersTableProps) => {
//     const defaultColumns = useMemo(() => [
//         { key: "serial", label: "Serial Number", render: (_: User, index: number) => index + 1 },
//         { key: "userId", label: "User ID" },
//         { key: "mobilePhone", label: "Mobile Phone Number" },
//         { key: "invitationCode", label: "Invitation Code" },
//         { key: "superiorId", label: "Superior ID" },
//         { key: "superiorName", label: "Superior Name" },
//         {
//             key: "operations",
//             label: "Operation",
//             render: (user: User) => (
//                 <div className="flex items-center space-x-1">
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => onEditUser(user)}
//                         aria-label={`Edit user ${user.userId}`}
//                     >
//                         <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => onNavigateToCollection(user)}
//                     >
//                         Collection settings
//                     </Button>
//                     <Button
//                         variant="secondary"
//                         size="sm"
//                         onClick={() => onAddAmount(user)}
//                     >
//                         Add amount
//                     </Button>
//                     <Button
//                         variant="destructive"
//                         size="sm"
//                         onClick={() => onDecreaseAmount(user)}
//                     >
//                         Decrease amount
//                     </Button>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon" aria-label="More actions">
//                                 <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent>
//                             <DropdownMenuItem onClick={() => onMoreAction("Freeze Member", user)}>
//                                 Freeze Member
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => onMoreAction("Withdrawal prohibited", user)}>
//                                 Withdrawal prohibited
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => onMoreAction("Prohibit accepting orders", user)}>
//                                 Prohibit accepting orders
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => onMoreAction("Set the user order amount", user)}>
//                                 Set the user order amount
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             )
//         },
//         { key: "userLevel", label: "User Level" },
//         { key: "quantityOrders", label: "Quantity of Orders" },
//         { key: "withdrawalValidOdd", label: "Withdrawal Valid Odd Number" },
//         { key: "actualCompletedToday", label: "Actual Completed Singular Number Today" },
//         { key: "userBalance", label: "User Balance" },
//         { key: "mobileTotalRecharge", label: "Mobile Total Recharge" },
//         { key: "membersTotalWithdrawal", label: "Member's Total Cash Withdrawal" },
//         { key: "orderFreezingAmount", label: "User's Order Freezing Amount" },
//         { key: "frozenWithdrawalAmount", label: "Amount Frozen in Withdrawal Amount" },
//         { key: "onlineStatus", label: "Online Status" },
//         { key: "whetherFreeze", label: "Whether to Freeze" },
//         { key: "mobileAreaCode", label: "Mobile Phone Area Code" },
//         {
//             key: "avatar",
//             label: "Avatar",
//             render: (user: User) => user.avatar ? "Avatar URL" : "None"
//         },
//         { key: "experienceGold", label: "Experience Gold" },
//         {
//             key: "email",
//             label: "Email",
//             render: (user: User) => user.email || "None"
//         },
//         { key: "totalSubordinates", label: "Total Number of Subordinates" },
//         { key: "registrationTime", label: "Registration Time" },
//         {
//             key: "lastLoginAddress",
//             label: "Last Login Address",
//             render: (user: User) => user.lastLoginAddress || "None"
//         },
//         {
//             key: "lastLoginIp",
//             label: "Last Login IP",
//             render: (user: User) => user.lastLoginIp || "None"
//         },
//         { key: "lastLoginTime", label: "Last Login Time" },
//         { key: "userType", label: "User Type" },
//     ], [onEditUser, onNavigateToCollection, onAddAmount, onDecreaseAmount, onMoreAction]);

//     const tableColumns = columns || defaultColumns;

//     return (
//         <div className="overflow-x-auto overflow-y-auto min-w-0">
//             <Table className="min-w-full">
//                 <TableHeader className="sticky top-0 z-10 bg-gray-200 dark:bg-primary/60">
//                     <TableRow className="text-center">
//                         {tableColumns.map((column) => (
//                             <TableHead key={column.key}>{column.label}</TableHead>
//                         ))}
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {data.map((user, index) => (
//                         <TableRow key={user.userId}>
//                             {tableColumns.map((column) => (
//                                 <TableCell key={`${user.userId}-${column.key}`}>
//                                     {column.render
//                                         ? column.render(user, index)
//                                         : user[column.key as keyof User]}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </div>
//     );
// };

// export default MembersTable;