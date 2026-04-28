import {
    //  useGetPlatformRechargeWithdrawQuery, 
    useGetSuperiorUserRechargeWithdrawQuery
} from "@/store/rtk/api/withdrawApi";
import { useState } from "react";


const SuperiorWithdraw = () => {
    const [filterSuperiorUserId, setFilterSuperiorUserId] = useState<string>("");
    const [groupBy, setGroupBy] = useState<"day" | "month">("day");

    // Fetch superior user recharge/withdraw data
    const { data: superiorData, isLoading: isSuperiorLoading, error: superiorError } =
        useGetSuperiorUserRechargeWithdrawQuery({
            filterSuperiorUserId: filterSuperiorUserId || undefined,
            groupBy,
        });

    // Fetch platform totals
    // const { data: platformData, isLoading: isPlatformLoading } =
    //     useGetPlatformRechargeWithdrawQuery();

    // Calculate totals from superior data
    const calculateTotals = () => {
        if (!superiorData?.data) return { totalRecharge: 0, totalWithdraw: 0 };
        return superiorData.data.reduce(
            (acc, item) => ({
                totalRecharge: acc.totalRecharge + item.totalRecharge,
                totalWithdraw: acc.totalWithdraw + item.totalWithdraw,
            }),
            { totalRecharge: 0, totalWithdraw: 0 }
        );
    };

    const totals = calculateTotals();

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (groupBy === "month") {
            return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
        }
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    // Group data by superior user
    // const groupedData = superiorData?.data.reduce((acc, item) => {
    //     if (!acc[item.superiorUserId]) {
    //         acc[item.superiorUserId] = [];
    //     }
    //     acc[item.superiorUserId].push(item);
    //     return acc;
    // }, {} as Record<string, typeof superiorData.data>);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-primary-dark p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Superior User Recharge & Withdraw
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Monitor and analyze recharge and withdrawal activities by superior users
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-primary-dark rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                Filter by Superior User ID
                            </label>
                            <input
                                type="text"
                                value={filterSuperiorUserId}
                                onChange={(e) => setFilterSuperiorUserId(e.target.value)}
                                placeholder="Enter Superior User ID (e.g., 6231588)"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                Group By
                            </label>
                            <select
                                value={groupBy}
                                onChange={(e) => setGroupBy(e.target.value as "day" | "month")}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="day" className="bg-white dark:bg-primary-dark">Daily</option>
                                <option value="month" className="bg-white dark:bg-primary-dark">Monthly</option>
                            </select>
                        </div>
                    </div>
                    {filterSuperiorUserId && (
                        <button
                            onClick={() => setFilterSuperiorUserId("")}
                            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-white mb-1">Total Recharge</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                                    {formatCurrency(totals.totalRecharge)}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-white mb-1">Total Withdraw</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                                    {formatCurrency(totals.totalWithdraw)}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-white mb-1">Net Balance</p>
                                <p
                                    className={`text-2xl font-bold ${totals.totalRecharge - totals.totalWithdraw >= 0
                                        ? "text-blue-600"
                                        : "text-orange-600"
                                        }`}
                                >
                                    {formatCurrency(totals.totalRecharge - totals.totalWithdraw)}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Recharge & Withdraw Details
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        {isSuperiorLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : superiorError ? (
                            <div className="px-6 py-12 text-center text-red-600">
                                Error loading data. Please try again.
                            </div>
                        ) : !superiorData?.data || superiorData.data.length === 0 ? (
                            <div className="px-6 py-12 text-center text-gray-500">
                                No data available for the selected filters.
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Superior User ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Period
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Recharge
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Withdraw
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Net Balance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {superiorData.data.map((item, index) => {
                                        const netBalance = item.totalRecharge - item.totalWithdraw;
                                        const hasActivity = item.totalRecharge > 0 || item.totalWithdraw > 0;
                                        return (
                                            <tr
                                                key={index}
                                                className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${!hasActivity ? "opacity-50" : ""
                                                    }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {item.superiorUserId}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                                        {formatDate(item.period)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                        {formatCurrency(item.totalRecharge)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                        {formatCurrency(item.totalWithdraw)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span
                                                        className={`text-sm font-semibold ${netBalance >= 0
                                                            ? "text-blue-600 dark:text-blue-400"
                                                            : "text-orange-600 dark:text-orange-400"
                                                            }`}
                                                    >
                                                        {formatCurrency(netBalance)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Platform Totals */}
                {/* <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Platform-Wide Statistics
                        </h2>
                        <p className="text-blue-100">
                            Total recharge and withdrawal across all users
                        </p>
                    </div>
                    {isPlatformLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                        </div>
                    ) : platformData?.data ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white text-black bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20">
                                <p className="text-black text-sm mb-2">Platform Total Recharge</p>
                                <p className="text-3xl font-bold text-black">
                                    {formatCurrency(platformData.data.totalRecharge)}
                                </p>
                            </div>
                            <div className="bg-white text-black bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20">
                                <p className="text-black text-sm mb-2">Platform Total Withdraw</p>
                                <p className="text-3xl font-bold text-black">
                                    {formatCurrency(platformData.data.totalWithdraw)}
                                </p>
                            </div>
                            <div className="bg-white text-black bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20">
                                <p className="text-black text-sm mb-2">Platform Net Balance</p>
                                <p className="text-3xl font-bold text-black">
                                    {formatCurrency(
                                        platformData.data.totalRecharge - platformData.data.totalWithdraw
                                    )}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-white text-center py-8">
                            Failed to load platform statistics.
                        </div>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default SuperiorWithdraw;