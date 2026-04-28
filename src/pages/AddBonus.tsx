import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddBonusMutation } from "@/store/rtk/api/bonusApi"
import { useState } from "react"
import { toast } from "react-toastify"

const AddBonus = () => {

    const [userId, setUserId] = useState("");
    const [bonusAmount, setBonusAmount] = useState("");
    const [notes, setNotes] = useState("");

    const [addBonus, { isLoading }] = useAddBonusMutation()


    const handleAddBonus = async () => {
        const payload = {
            amount: Number(bonusAmount),
            notes
        }
        const res = await addBonus({ userId, payload })
        // console.log(res)
        if (res.data) {
            toast.success("Bonus added successfully")
            setUserId("")
            setBonusAmount("")
            setNotes("")
        }
    }



    return (
        <div className="flex justify-start mt-10 ml-10 gap-2">
            <div className="flex flex-col gap-2">
                <Label>User ID</Label>
                <div>
                    <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
                </div>
                <Label>Bonus Amount</Label>
                <div>
                    <Input type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} placeholder="Bonus Amount" />
                </div>
                <Label>Notes</Label>
                <div>
                    <textarea className="border rounded-md p-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
                </div>
                <div>
                    <Button
                        className="bg-primary text-white cursor-pointer"
                        onClick={handleAddBonus}
                        disabled={isLoading}
                    >{isLoading ? "Adding Bonus..." : "Add Bonus"}</Button>
                </div>
            </div>
        </div>
    )
}

export default AddBonus