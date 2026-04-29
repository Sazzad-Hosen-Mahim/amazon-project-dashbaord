import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Loader2,
  Plus,
  Search,
  RotateCcw,
  Image as ImageIcon,
  MoreVertical,
  Calendar,
  Clock,
  AlertCircle
} from "lucide-react";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  type Product,
} from "@/store/rtk/api/productApi";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

const ProductList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Search filters
  const [searchProductId, setSearchProductId] = useState("");
  const [searchName, setSearchName] = useState("");

  const { data, isLoading, isFetching, refetch } = useGetAllProductsQuery({ page, limit });
  const products = data?.data ?? [];
  const meta = data?.meta;

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Unified Modal State to prevent multiple overlays and focus clashes
  type ModalType = 'add' | 'edit' | 'delete' | null;
  const [activeModal, setActiveModal] = useState<{ type: ModalType; isOpen: boolean; product: Product | null }>({
    type: null,
    isOpen: false,
    product: null
  });

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    commission: "",
    salePrice: "",
    introduction: "",
    poster: null as File | null,
  });

  const resetForm = () => {
    setFormData({ name: "", price: "", commission: "", salePrice: "", introduction: "", poster: null });
  };

  const closeModal = () => {
    setActiveModal(prev => ({ ...prev, isOpen: false }));
    // Wait for animation to finish before clearing data to avoid layout shifts/crashes
    setTimeout(() => {
      setActiveModal({ type: null, isOpen: false, product: null });
      resetForm();
    }, 200);
  };

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.poster) {
      toast.error("Name and poster are required");
      return;
    }

    try {
      await createProduct({
        name: formData.name,
        introduction: formData.introduction,
        poster: formData.poster,
      }).unwrap();

      toast.success("Product created successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create product");
    }
  };

  const handleUpdateProduct = async () => {
    if (!activeModal.product) return;

    try {
      await updateProduct({
        productId: activeModal.product.productId,
        name: formData.name || undefined,
        price: formData.price || undefined,
        commission: formData.commission || undefined,
        salePrice: formData.salePrice || undefined,
        introduction: formData.introduction || undefined,
        poster: formData.poster || null,
      }).unwrap();

      toast.success("Product updated successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async () => {
    if (!activeModal.product) return;
    try {
      await deleteProduct(activeModal.product.productId).unwrap();
      toast.success("Product deleted successfully!");
      closeModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  const openAdd = () => {
    resetForm();
    setActiveModal({ type: 'add', isOpen: true, product: null });
  };

  const openEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: String(product.price || ""),
      commission: String(product.commission || ""),
      salePrice: String(product.salePrice || ""),
      introduction: product.introduction || "",
      poster: null,
    });
    setActiveModal({ type: 'edit', isOpen: true, product });
  };

  const openDelete = (product: Product) => {
    setActiveModal({ type: 'delete', isOpen: true, product });
  };

  const filteredProducts = products.filter((p) => {
    const matchesId = searchProductId ? String(p.productId).includes(searchProductId) : true;
    const matchesName = searchName ? p.name.toLowerCase().includes(searchName.toLowerCase()) : true;
    return matchesId && matchesName;
  });

  // Emergency cleanup effect: ensure pointer-events are restored if all modals are closed
  useEffect(() => {
    if (!activeModal.isOpen) {
      document.body.style.pointerEvents = 'auto';
    }
  }, [activeModal.isOpen]);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground mt-1">Manage your Amazon product catalog, updates, and listings.</p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Filters Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card p-6 rounded-xl border shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="searchId" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product ID</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchId"
              placeholder="Search by ID..."
              className="pl-9 h-11"
              value={searchProductId}
              onChange={(e) => setSearchProductId(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="searchName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="searchName"
              placeholder="Search by name..."
              className="pl-9 h-11"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <Button variant="outline" className="h-11 flex-1 font-semibold" onClick={() => { setSearchProductId(""); setSearchName(""); }}>
            <RotateCcw className="mr-2 h-4 w-4" /> RESET
          </Button>
          <Button variant="secondary" className="h-11 flex-1 font-semibold" onClick={() => refetch()}>
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="mr-2 h-4 w-4" />}
            REFRESH
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Introduction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Loading catalog...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                    No products found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{product.productId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {product.poster ? (
                            <img
                              src={product.poster}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
                              }}
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{product.name}</span>
                          {/* <span className="text-[10px] text-primary uppercase tracking-wider font-extrabold">
                            {product.salePrice ? `$${Number(product.salePrice).toFixed(2)}` : 'No Price'}
                          </span> */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate text-sm text-muted-foreground" title={product.introduction}>
                        {product.introduction || "---"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tight ${product.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 opacity-50" />
                        {product.createdAt ? format(new Date(product.createdAt), "MMM d, yyyy") : "---"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 opacity-50" />
                        {product.updatedAt ? format(new Date(product.updatedAt), "HH:mm") : "---"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted transition-all active:scale-90">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 shadow-xl border-muted/20">
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              openEdit(product);
                            }}
                            className="cursor-pointer gap-2 py-2"
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                            <span>Edit Product</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              openDelete(product);
                            }}
                            className="cursor-pointer gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Product</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Info */}
        <div className="p-4 border-t bg-muted/20 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
            {meta ? `Database Total: ${meta.total}` : `Showing ${filteredProducts.length} items`}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-4 text-xs font-semibold uppercase tracking-wider"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <div className="flex items-center justify-center min-w-[80px] h-8 bg-muted/30 rounded-md text-[11px] font-bold">
              PAGE {page}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-4 text-xs font-semibold uppercase tracking-wider"
              onClick={() => setPage(p => p + 1)}
              disabled={products.length < limit}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Single Controlled Dialog to prevent Overlay Conflicts */}
      <Dialog open={activeModal.isOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className={`border-none shadow-2xl ${activeModal.type === 'delete' ? 'sm:max-w-[420px]' : 'sm:max-w-[600px]'} max-h-[90vh] overflow-y-auto`}>

          {/* Add Product Content */}
          {activeModal.type === 'add' && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">New Product Listing</DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  Create a new entry in your Amazon product database.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name</Label>
                  <Input
                    placeholder="Enter full product title..."
                    className="h-11 bg-muted/20 border-muted-foreground/10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Introduction</Label>
                  <textarea
                    className="flex min-h-[120px] w-full rounded-md border border-muted-foreground/10 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Describe the product features..."
                    value={formData.introduction}
                    onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Image</Label>
                  <div className="flex flex-col gap-4">
                    <div className="relative h-11 border-dashed border-2 rounded-md border-muted-foreground/20 hover:border-primary/40 transition-all flex items-center justify-center">
                      <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setFormData({ ...formData, poster: file });
                        }}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {formData.poster ? "Change Selected Image" : "Click to upload poster image"}
                      </span>
                    </div>
                    {formData.poster && (
                      <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-[10px] text-green-600 font-bold uppercase truncate">
                        ✓ {formData.poster.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-3 border-t pt-6">
                <Button variant="ghost" onClick={closeModal} className="font-bold">CANCEL</Button>
                <Button onClick={handleCreateProduct} disabled={isCreating} className="font-bold px-8">
                  {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {isCreating ? "CREATING..." : "CREATE LISTING"}
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Edit Product Content */}
          {activeModal.type === 'edit' && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Pencil className="h-5 w-5 text-primary" /> Edit Product
                </DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  Update pricing and catalog details for <span className="text-foreground font-bold">#{activeModal.product?.productId}</span>.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Product Name</Label>
                  <Input
                    className="h-11 bg-muted/20 border-muted-foreground/10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price</Label>
                    <Input
                      type="number"
                      className="h-11 bg-muted/20 border-muted-foreground/10"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sale Price</Label>
                    <Input
                      type="number"
                      className="h-11 bg-muted/20 border-muted-foreground/10 font-bold text-primary"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Commission</Label>
                    <Input
                      type="number"
                      className="h-11 bg-muted/20 border-muted-foreground/10"
                      value={formData.commission}
                      onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Introduction</Label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-muted-foreground/10 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.introduction}
                    onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Update Image (Optional)</Label>
                  <div className="relative h-11 border-dashed border-2 rounded-md border-muted-foreground/20 hover:border-primary/40 transition-all flex items-center justify-center">
                    <Input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFormData({ ...formData, poster: file });
                      }}
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {formData.poster ? "Image Selected" : "Click to replace current image"}
                    </span>
                  </div>
                  {formData.poster && (
                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-600 font-bold uppercase truncate">
                      ✓ {formData.poster.name}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="gap-3 border-t pt-6">
                <Button variant="ghost" onClick={closeModal} className="font-bold">DISCARD</Button>
                <Button onClick={handleUpdateProduct} disabled={isUpdating} className="font-bold px-8 shadow-lg shadow-primary/20">
                  {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "SAVE CHANGES"}
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Delete Product Content */}
          {activeModal.type === 'delete' && (
            <>
              <DialogHeader className="space-y-4 pt-4">
                <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto sm:mx-0">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
                  <DialogDescription className="text-sm font-medium leading-relaxed">
                    Are you sure you want to delete <span className="text-foreground font-bold">"{activeModal.product?.name}"</span>? This action cannot be reversed.
                  </DialogDescription>
                </div>
              </DialogHeader>
              <DialogFooter className="gap-3 mt-6">
                <Button variant="outline" onClick={closeModal} className="font-bold">KEEP PRODUCT</Button>
                <Button variant="destructive" onClick={handleDeleteProduct} disabled={isDeleting} className="font-bold shadow-lg shadow-destructive/20">
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "DELETE PERMANENTLY"}
                </Button>
              </DialogFooter>
            </>
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;