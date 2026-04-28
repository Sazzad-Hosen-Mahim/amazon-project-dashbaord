import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AddAmountDialog,
  DecreaseAmountDialog,
  // EditMemberDialog,
  NewMemberDialog,
} from "@/components/dialog";
import { useMemberActions } from "@/hooks/useMemberList";
import MemberTable from "@/components/memberList/MemberTable";
import { Loader2 } from "lucide-react";
import { useGetMembersQuery } from "@/store/rtk/api/memberApi";
import { addSocketListener, removeSocketListener } from "@/utils/socket";

const MemberList = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Search filters state
  const [userIdSearch, setUserIdSearch] = useState("");
  const [mobileMantissaSearch, setMobileMantissaSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [ipSearch, setIpSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");

  // Applied filters (only used after clicking Query button)
  const [appliedFilters, setAppliedFilters] = useState({
    userId: "",
    phoneLast4: "",
    name: "",
    ip: "",
    userType: "",
  });

  // Fetch members with current page and applied filters
  const { data: response, isLoading, isFetching, error, refetch } = useGetMembersQuery({
    page,
    limit,
    userId: appliedFilters.userId || undefined,
    phoneLast4: appliedFilters.phoneLast4 || undefined,
    name: appliedFilters.name || undefined,
    ip: appliedFilters.ip || undefined,
    userType: appliedFilters.userType || undefined,
  }, {
    refetchOnMountOrArgChange: true,
  });

  // Listen for socket updates to refetch member list realtime
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleRefetch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        refetch();
      }, 500);
    };

    // Listen for generic connect and specific status updates
    addSocketListener("connect", handleRefetch);
    addSocketListener("user_status_update", handleRefetch);
    addSocketListener("online_users", handleRefetch);
    // Add these back as they are likely needed
    addSocketListener("user_connected", handleRefetch);
    addSocketListener("user_disconnected", handleRefetch);
    addSocketListener("users_online", handleRefetch);

    return () => {
      clearTimeout(timeoutId);
      removeSocketListener("connect", handleRefetch);
      removeSocketListener("user_status_update", handleRefetch);
      removeSocketListener("online_users", handleRefetch);
      removeSocketListener("user_connected", handleRefetch);
      removeSocketListener("user_disconnected", handleRefetch);
      removeSocketListener("users_online", handleRefetch);
    };
  }, [refetch]);


  // Debug: Log API response
  console.log('API Response:', response);

  const {
    selectedUser,
    // editOpen,
    newMemberOpen,
    addAmountOpen,
    decreaseAmountOpen,
    // openEdit,
    openNew,
    openAddAmount,
    openDecreaseAmount,
    // closeEdit,
    closeNew,
    closeAddAmount,
    closeDecreaseAmount,
    handleMoreAction,
  } = useMemberActions();

  const handleSearch = () => {
    // Apply the current filter values and reset to page 1
    setAppliedFilters({
      userId: userIdSearch,
      phoneLast4: mobileMantissaSearch,
      name: nameSearch,
      ip: ipSearch,
      userType: userTypeFilter === "all" ? "" : userTypeFilter,
    });
    setPage(1);

    setTimeout(() => refetch(), 0);
  };

  const handleReset = () => {
    // Clear all search inputs
    setUserIdSearch("");
    setMobileMantissaSearch("");
    setNameSearch("");
    setIpSearch("");
    setUserTypeFilter("all");

    // Clear applied filters
    setAppliedFilters({
      userId: "",
      phoneLast4: "",
      name: "",
      ip: "",
      userType: "",
    });

    // Reset to page 1
    setPage(1);
  };

  const handleMemberCreated = () => {
    // After creating a member, reset to page 1 to see the new member
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newLimit: number) => {
    console.log('Limit changed to:', newLimit);
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing page size
  };

  // Debug: Log current state
  console.log('Current page:', page);
  console.log('Current limit:', limit);

  // Create pagination info from API response
  const paginationInfo = response ? {
    currentPage: response.page || page,
    totalPages: response.totalPages || 1,
    totalItems: response.total || 0,
    limit: response.limit || limit,
  } : undefined;

  console.log('Calculated pagination info:', paginationInfo);

  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Please enter the user ID"
          value={userIdSearch}
          onChange={(e) => setUserIdSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Input
          placeholder="Please enter the four-digit mantissa"
          value={mobileMantissaSearch}
          onChange={(e) => setMobileMantissaSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          maxLength={4}
        />
        <Input
          placeholder="Please enter your name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Input
          placeholder="Please enter the ip address"
          value={ipSearch}
          onChange={(e) => setIpSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Select value={userTypeFilter || "all"} onValueChange={setUserTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Please select the type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} disabled={isFetching} className="text-white cursor-pointer">
          {isFetching && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Query
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isFetching} className="cursor-pointer">
          Reset
        </Button>
        <Button onClick={openNew} className="text-white cursor-pointer">New</Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Error loading members. Please try again.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
        </div>
      )}

      {/* Table with Pagination */}
      {!isLoading && !error && (
        <MemberTable
          data={response?.data || []}
          onAddAmount={openAddAmount}
          onDecreaseAmount={openDecreaseAmount}
          onMoreAction={handleMoreAction}
          pagination={paginationInfo}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isFetching}
        />
      )}

      {/* Dialogs */}
      {/* <EditMemberDialog
        open={editOpen}
        onOpenChange={closeEdit}
        selectedUser={selectedUser}
        onSave={closeEdit}
      /> */}

      <NewMemberDialog
        open={newMemberOpen}
        onOpenChange={closeNew}
        onMemberCreated={handleMemberCreated}
      />

      <AddAmountDialog
        open={addAmountOpen}
        onOpenChange={closeAddAmount}
        onConfirm={closeAddAmount}
        userId={selectedUser?.userId}
      />

      <DecreaseAmountDialog
        open={decreaseAmountOpen}
        onOpenChange={closeDecreaseAmount}
        onConfirm={closeDecreaseAmount}
        userId={selectedUser?.userId}
      />
    </div>
  );
};

export default MemberList;