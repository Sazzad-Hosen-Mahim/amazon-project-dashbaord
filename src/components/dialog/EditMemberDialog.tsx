// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import type { User } from "@/types/user";

// interface Props {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     selectedUser: User | null;
//     onSave: () => void;
// }

// const EditMemberDialog = ({
//     open,
//     onOpenChange,
//     selectedUser,
//     onSave,
// }: Props) => {
//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Edit</DialogTitle>
//                     <DialogDescription>
//                         Edit user details for ID: {selectedUser?.userId}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="grid gap-4 py-4">
//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label className="text-right">Mobile phone area code</Label>
//                         <Input
//                             defaultValue={selectedUser?.mobileAreaCode || "+880"}
//                             className="col-span-3"
//                         />
//                     </div>

//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label className="text-right">Mobile phone number</Label>
//                         <Input
//                             defaultValue={selectedUser?.mobilePhone}
//                             className="col-span-3"
//                         />
//                     </div>

//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label className="text-right">Superior ID</Label>
//                         <Input
//                             defaultValue={selectedUser?.superiorId}
//                             className="col-span-3"
//                         />
//                     </div>
//                 </div>

//                 <DialogFooter>
//                     <Button onClick={onSave}>Save changes</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default EditMemberDialog;
