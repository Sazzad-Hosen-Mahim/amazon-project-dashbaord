import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetAllProductsQuery,
  type Product
} from "@/store/rtk/api/productApi";
import {
  useAssignProductsMutation,
  useUpdateMultipleProductPricesMutation,
  useGetMembersQuery
} from "@/store/rtk/api/memberApi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Search,
  Trash2,
  CheckCircle2,
  LayoutGrid,
  UserCircle,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import type { AssignedProductState } from "@/types/user";

const CollectionSettings = () => {
  const { id: userIdStr } = useParams();
  const userId = Number(userIdStr);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  // RTK Query hooks
  const { data: userData } = useGetMembersQuery({ userId: userIdStr });
  const user = userData?.data?.[0]; // Assuming getMembers returns an array

  const { data: productsData, isLoading: isProductsLoading } = useGetAllProductsQuery({ page, limit });
  const [assignProducts, { isLoading: isAssigning }] = useAssignProductsMutation();
  const [updatePrices, { isLoading: isUpdating }] = useUpdateMultipleProductPricesMutation();

  const products = productsData?.data || [];
  const meta = productsData?.meta;

  // State for the assignment
  const [assignmentType, setAssignmentType] = useState<"trial" | "normal" | "group">("normal");
  const [selectedProducts, setSelectedProducts] = useState<AssignedProductState[]>([]);

  // Effect to populate existing assignments
  useEffect(() => {
    if (user?.assainProductsIds) {
      setAssignmentType(user.assainProductsIds.type as any);
      const existing = user.assainProductsIds.products.map((p: any) => {
        // Find product name from the master list if available, otherwise use a placeholder
        // Note: The master list might not have all assigned products due to pagination
        return {
          productId: p.productId, // This is the _id of the product
          name: p.name || "Assigned Product",
          price: String(p.price),
          commission: String(p.commission),
          isExisting: true,
          productItemId: p._id // The inner ID for updates if needed
        };
      });
      setSelectedProducts(existing);
    }
  }, [user]);

  // Selection logic for the bottom table
  const handleToggleProduct = (product: Product) => {
    const exists = selectedProducts.find(p => p.productId === product._id);
    if (exists) {
      setSelectedProducts(prev => prev.filter(p => p.productId !== product._id));
    } else {
      setSelectedProducts(prev => [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: String(product.salePrice || product.price || 0),
          commission: String(product.commission || 0),
        }
      ]);
    }
  };

  const handleUpdatePrice = (productId: string, price: string) => {
    setSelectedProducts(prev => prev.map(p => p.productId === productId ? { ...p, price } : p));
  };

  const handleUpdateCommission = (productId: string, commission: string) => {
    setSelectedProducts(prev => prev.map(p => p.productId === productId ? { ...p, commission } : p));
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
  };

  const handleAssign = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    const payload = {
      userId,
      type: assignmentType,
      products: selectedProducts.map(p => ({
        productId: p.productId,
        price: Number(p.price),
        commission: Number(p.commission)
      }))
    };

    try {
      await assignProducts(payload).unwrap();
      toast.success("Products assigned successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign products");
    }
  };

  const handleUpdatePrices = async () => {
    if (!user?.assainProductsIds) return;

    const payload = {
      selectedProductsId: user.assainProductsIds._id,
      updatesProductPrices: selectedProducts.map(p => ({
        productItemId: p.productId,
        price: Number(p.price),
        commission: Number(p.commission)
      }))
    };

    try {
      await updatePrices(payload).unwrap();
      toast.success("Product prices updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update prices");
    }
  };

  const filteredMasterProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(p.productId).includes(searchQuery)
    );
  }, [products, searchQuery]);

  if (isProductsLoading || !user && userData) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Syncing User Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-muted/30 min-h-screen animate-in fade-in duration-500">
      {/* Header Card */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <UserCircle className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assignment Settings</h1>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Target User ID: <span className="text-foreground font-bold">{userId}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-bold h-11" onClick={() => window.history.back()}>
            BACK
          </Button>

          {user?.assainProductsIds && (
            <Button
              onClick={handleUpdatePrices}
              disabled={isUpdating || isAssigning || selectedProducts.length === 0}
              variant="secondary"
              className="h-11 px-6 font-bold border-2 border-primary/20"
            >
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRightLeft className="mr-2 h-4 w-4" />}
              {isUpdating ? "UPDATING PRICES..." : "UPDATE PRICES"}
            </Button>
          )}

          <Button
            onClick={handleAssign}
            disabled={isAssigning || isUpdating || selectedProducts.length === 0}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-8 font-bold"
          >
            {isAssigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            {isAssigning ? "ASSIGNING..." : "ASSIGN PRODUCT"}
          </Button>
        </div>
      </div>

      {/* Shareable Link Section */}
      {user?.shareableLink && (
        <div className="bg-primary/5 border-2 border-primary/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-left duration-500 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ExternalLink className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Shareable Task Link</p>
              <p className="text-sm font-mono text-muted-foreground truncate max-w-[300px] md:max-w-md">{user.shareableLink}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopyLink(user.shareableLink!)}
            className="font-bold border-primary/20 hover:bg-primary hover:text-white transition-all gap-2"
          >
            <Copy className="h-4 w-4" />
            COPY LINK
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">

        {/* TOP SECTION: Assignment Table */}
        {selectedProducts.length > 0 && (
          <div className="bg-card border rounded-2xl overflow-hidden shadow-md animate-in slide-in-from-top duration-300">
            <div className="p-5 border-b bg-muted/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg">Product Assignment Table</h2>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Assignment Type</Label>
                <Select value={assignmentType} onValueChange={(val: any) => setAssignmentType(val)}>
                  <SelectTrigger className="w-[180px] h-10 font-bold">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">TRIAL</SelectItem>
                    <SelectItem value="normal">NORMAL</SelectItem>
                    <SelectItem value="group">GROUP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">PID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="w-[180px]">Custom Price ($)</TableHead>
                  <TableHead className="w-[180px]">Commission ($)</TableHead>
                  <TableHead className="text-right px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProducts.map((p) => (
                  <TableRow key={p.productId} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs opacity-60">#{p.productId.slice(-6)}</TableCell>
                    <TableCell className="font-medium text-sm">{p.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={p.price}
                        onChange={(e) => handleUpdatePrice(p.productId, e.target.value)}
                        className="h-9 bg-muted/20 focus:bg-background transition-all font-bold"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={p.commission}
                        onChange={(e) => handleUpdateCommission(p.productId, e.target.value)}
                        className="h-9 bg-muted/20 focus:bg-background transition-all"
                      />
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveProduct(p.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 bg-primary/5 border-t text-[10px] font-bold text-primary uppercase tracking-[0.2em] text-center">
              {selectedProducts.length} Product(s) ready for assignment
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: Master Product List */}
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b bg-muted/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-bold text-lg">Master Product Catalog</h2>
            </div>
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 h-10 rounded-full bg-muted/50 focus:bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[50px] px-6">Select</TableHead>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Introduction</TableHead>
                <TableHead className="text-right px-6">Sale Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isProductsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-20" />
                  </TableCell>
                </TableRow>
              ) : filteredMasterProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                    No products found in catalog.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMasterProducts.map((p) => {
                  const isSelected = selectedProducts.some(sp => sp.productId === p._id);
                  return (
                    <TableRow key={p._id} className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                      <TableCell className="px-6">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleProduct(p)}
                          className="h-5 w-5"
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">#{p.productId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded border overflow-hidden bg-muted shrink-0">
                            <img src={p.poster} alt={p.name} className="h-full w-full object-cover" />
                          </div>
                          <span className="font-semibold text-sm">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="truncate text-xs text-muted-foreground">{p.introduction}</p>
                      </TableCell>
                      <TableCell className="text-right px-6 font-bold text-primary text-sm">
                        ${Number(p.salePrice || p.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="p-4 border-t flex items-center justify-between bg-muted/10">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {meta ? `Total: ${meta.total}` : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-bold w-12 text-center">PAGE {page}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={products.length < limit}
                onClick={() => setPage(p => p + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionSettings;