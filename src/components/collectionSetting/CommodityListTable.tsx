import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
    _id: string;
    productId: number;
    status: string;
    name: string;
    price: number;
    commission: number;
    salePrice: number;
    introduction: string;
    poster: string;
    isAdminAssigned: boolean;
}

interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface Props {
    data: Product[];
    selectedCommodities: string[];
    selectAll: boolean;
    onToggleCommodity: (id: string) => void;
    onToggleSelectAll: () => void;
    meta?: PaginationMeta;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const CommodityListTable = ({
    data,
    selectedCommodities,
    selectAll,
    onToggleCommodity,
    onToggleSelectAll,
    meta,
    currentPage,
    onPageChange,
}: Props) => {
    const totalPages = meta?.totalPages ?? 1;
    const totalItems = meta?.total ?? data.length;
    const limit = meta?.limit ?? 10;

    const showPagination = totalPages > 1;

    // Debug logging
    // console.log('=== CommodityListTable Pagination ===');
    // console.log('Meta:', meta);
    // console.log('Current page:', currentPage);
    // console.log('Total pages:', totalPages);
    // console.log('Total items:', totalItems);
    // console.log('Show pagination:', showPagination);
    // console.log('Data length:', data.length);
    // console.log('====================================');

    return (
        <div className="bg-white dark:bg-primary-dark rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 dark:bg-primary-dark">
                <h3 className="font-semibold text-lg">Commodity List</h3>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-300 dark:bg-primary/60 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox checked={selectAll} onCheckedChange={onToggleSelectAll} />
                            </TableHead>
                            <TableHead className="text-center">Serial number</TableHead>
                            <TableHead>Product ID</TableHead>
                            <TableHead>Product name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Sale Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Product introduction</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                    No products available
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedCommodities.includes(item._id)}
                                            onCheckedChange={() => onToggleCommodity(item._id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {(currentPage - 1) * limit + index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium">{item.productId}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.price.toLocaleString()}</TableCell>
                                    <TableCell>{item.commission.toLocaleString()}</TableCell>
                                    <TableCell>{item.salePrice.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${item.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="max-w-md truncate">
                                        {item.introduction}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {showPagination && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 dark:bg-primary-dark">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {(currentPage - 1) * limit + 1}–
                        {Math.min(currentPage * limit, totalItems)} of {totalItems}
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-primary-dark/80 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                            const num = i + Math.max(1, currentPage - 3);
                            if (num > totalPages) return null;
                            return (
                                <button
                                    key={num}
                                    onClick={() => onPageChange(num)}
                                    className={`px-3 py-1 border rounded transition-colors ${currentPage === num
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-white dark:hover:bg-primary-dark/80"
                                        }`}
                                >
                                    {num}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-primary-dark/80 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommodityListTable;