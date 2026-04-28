import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import MysteryBoxModal from "../dialog/MysteryBoxModal";

interface SelectedProduct {
    id: string;
    productId: number;
    name: string;
    price: number;
    salePrice: number;
    introduction: string;
    orderNumber: number;
    mysteryboxMethod?: string;
    mysteryboxAmount?: string;
}

interface Props {
    data: SelectedProduct[];
    onDelete: (id: string) => void;
    onUpdateOrderNumber: (id: string, orderNumber: number) => void;
    onUpdateMysteryBox: (id: string, method: string, amount: string) => void;
}

const SingleNumbersTable = ({
    data,
    onDelete,
    onUpdateOrderNumber,
    onUpdateMysteryBox,
}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [currentMethod, setCurrentMethod] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [editingValues, setEditingValues] = useState<Record<string, string>>({});

    const handleOrderNumberChange = (id: string, value: string) => {
        // Store the current input value locally
        setEditingValues(prev => ({ ...prev, [id]: value }));
    };

    const handleOrderNumberBlur = (id: string) => {
        const value = editingValues[id];
        const orderNumber = parseInt(value, 10);

        // On blur, validate and update or reset to current value
        if (!isNaN(orderNumber) && orderNumber >= 1) {
            onUpdateOrderNumber(id, orderNumber);
        }

        // Clear local editing state
        setEditingValues(prev => {
            const newValues = { ...prev };
            delete newValues[id];
            return newValues;
        });
    };

    const handleEditMysteryBox = (product: SelectedProduct) => {
        setSelectedProductId(product.id);
        setCurrentMethod(product.mysteryboxMethod || "");
        setCurrentAmount(product.mysteryboxAmount || "");
        setIsModalOpen(true);
    };

    const handleConfirmMysteryBox = (method: string, amount: string) => {
        if (selectedProductId) {
            onUpdateMysteryBox(selectedProductId, method, amount);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
        setCurrentMethod("");
        setCurrentAmount("");
    };

    return (
        <>
            <div className="bg-white dark:bg-primary-dark rounded-lg shadow-sm overflow-hidden mb-8">
                <div className="p-4 border-b bg-gray-50 dark:bg-primary-dark">
                    <h3 className="font-semibold text-lg">List of single numbers</h3>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-300 dark:bg-primary/60 sticky top-0 z-10">
                                <TableHead className="text-center">Serial number</TableHead>
                                <TableHead>Product ID</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Order Number</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Sale Price</TableHead>
                                <TableHead className="text-center">Mystery Box</TableHead>
                                <TableHead className="text-center">Operation</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                        No products selected. Select products from the Commodity List below.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item, index) => (
                                    <TableRow key={item.id} className="dark:bg-primary-dark">
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{item.productId}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <input
                                                type="number"
                                                min="1"
                                                value={editingValues[item.id] ?? item.orderNumber}
                                                onChange={(e) => handleOrderNumberChange(item.id, e.target.value)}
                                                onBlur={() => handleOrderNumberBlur(item.id)}
                                                className="p-1 border border-gray-700 rounded w-20"
                                            />
                                        </TableCell>
                                        <TableCell>{item.price.toLocaleString()}</TableCell>
                                        <TableCell>{item.salePrice.toLocaleString()}</TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditMysteryBox(item)}
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                {item.mysteryboxMethod ? "Edit" : "Set"}
                                            </Button>
                                            {item.mysteryboxMethod && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {item.mysteryboxMethod}: {item.mysteryboxAmount}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => onDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <MysteryBoxModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmMysteryBox}
                initialMethod={currentMethod}
                initialAmount={currentAmount}
            />
        </>
    );
};

export default SingleNumbersTable;