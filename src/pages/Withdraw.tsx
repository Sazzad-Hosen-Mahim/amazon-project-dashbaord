import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Download, RefreshCw, Loader2 } from "lucide-react";
import WithdrawTable from "@/components/withdraw/WithdrawalTable";
import { useGetAllWithdrawsQuery } from "@/store/rtk/api/withdrawApi";

const Withdraw = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Search & Filter States (input fields)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [userId, setUserId] = useState("");
  // const [mobile, setMobile] = useState("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [name, setName] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [orderAmount, setOrderAmount] = useState("");
  const [screenAmount, setScreenAmount] = useState("");

  // Applied filters (only used after clicking Query button)
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    paymentMethod: "",
    userId: "",
    phoneLast4: "",
    orderNumber: "",
    name: "",
    transactionStatus: "" as "" | "APPROVED" | "REJECTED" | "PENDING",
    orderAmount: "",
    screenAmount: "",
  });

  // Fetch withdrawals from API with applied filters
  const { data: withdrawData, isLoading, isFetching, error, refetch } = useGetAllWithdrawsQuery(
    {
      page,
      limit,
      userId: appliedFilters.userId ? Number(appliedFilters.userId) : undefined,
      phoneLast4: appliedFilters.phoneLast4 || undefined,
      orderNumber: appliedFilters.orderNumber || undefined,
      name: appliedFilters.name || undefined,
      transactionStatus: appliedFilters.transactionStatus || undefined,
    },
    {
      refetchOnMountOrArgChange: true, // Prevent caching issues
    }
  );

  // Summary Stats (calculate from API data)
  const calculateStats = () => {
    if (!withdrawData?.data) return { successful: 0, failed: 0, unprocessed: 0 };

    const successful = withdrawData.data
      .filter((w) => w.transactionStatus === "APPROVED")
      .reduce((sum, w) => sum + (w.actualAmount || 0), 0);

    const failed = withdrawData.data
      .filter((w) => w.transactionStatus === "REJECTED")
      .reduce((sum, w) => sum + (w.actualAmount || 0), 0);

    const unprocessed = withdrawData.data
      .filter((w) => w.transactionStatus === "PENDING")
      .reduce((sum, w) => sum + (w.actualAmount || 0), 0);

    return { successful, failed, unprocessed };
  };

  const { successful, failed, unprocessed } = calculateStats();

  console.log(phoneLast4, "aaaaaaaa")

  const handleQuery = () => {
    // Apply the current filter values and reset to page 1
    setAppliedFilters({
      startDate,
      endDate,
      paymentMethod: paymentMethod === "all" ? "" : paymentMethod,
      userId,
      phoneLast4,
      orderNumber,
      name,
      transactionStatus: (transactionStatus === "all" ? "" : transactionStatus) as "" | "APPROVED" | "REJECTED" | "PENDING",
      orderAmount,
      screenAmount,
    });
    setPage(1); // Reset to first page when applying filters

    refetch();
  };

  const handleReset = () => {
    // Clear all search inputs
    setStartDate(undefined);
    setEndDate(undefined);
    setPaymentMethod("");
    setUserId("");
    setPhoneLast4("");
    setOrderNumber("");
    setName("");
    setTransactionStatus("");
    setOrderAmount("");
    setScreenAmount("");

    // Clear applied filters
    setAppliedFilters({
      startDate: undefined,
      endDate: undefined,
      paymentMethod: "",
      userId: "",
      phoneLast4: "",
      orderNumber: "",
      name: "",
      transactionStatus: "",
      orderAmount: "",
      screenAmount: "",
    });

    // Reset to page 1
    setPage(1);

  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-primary-dark min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-primary-dark min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading withdrawals</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-primary-dark min-h-screen">
      {/* Summary Stats */}
      <div className="mb-6 text-lg font-semibold">
        Withdrawal successful:{" "}
        <span className="text-green-600">৳{successful.toLocaleString()}</span> |
        Withdrawal failed:{" "}
        <span className="text-red-600">৳{failed.toLocaleString()}</span> |
        Unprocessed:{" "}
        <span className="text-orange-600">৳{unprocessed.toLocaleString()}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button variant="default">Manual replenishment</Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
        <Button variant="outline">Export by condition</Button>
      </div>

      {/* Filters Row 1: Date + Payment Method */}
      <div className="bg-white dark:bg-primary-dark rounded-lg shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate
                    ? format(startDate, "PPP")
                    : "Please select the start"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Please select the end"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Payment method
            </label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Please choose the withdrawal method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="usdt">USDT TRC20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              User id query
            </label>
            <Input
              type="number"
              placeholder="Please enter the user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile phone number (last 4 digit)
            </label>
            <Input
              placeholder="Please enter last 4 digit of phone number"
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Order number query
            </label>
            <Input
              placeholder="Please enter the order number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              placeholder="Please enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Transaction status
            </label>
            <Select
              value={transactionStatus}
              onValueChange={setTransactionStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Order Amount
            </label>
            <Input
              type="number"
              placeholder="Please enter the order amount"
              value={orderAmount}
              onChange={(e) => setOrderAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Screen accounts
            </label>
            <Input
              type="number"
              placeholder="Enter screen amount"
              value={screenAmount}
              onChange={(e) => setScreenAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            />
          </div>
          <div className="flex items-end gap-3">
            <Button onClick={handleQuery} disabled={isFetching}>
              {isFetching && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Query
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isFetching}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <WithdrawTable
        data={withdrawData?.data || []}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        isLoading={isFetching}
      />
    </div>
  );
};

export default Withdraw;