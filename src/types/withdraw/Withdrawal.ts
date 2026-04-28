// -----------------------------------------------------------------------------
// withdrawApi.ts  or  types/withdrawal.ts
// -----------------------------------------------------------------------------

export interface BaseWithdrawal {
    _id: string;
    userId: number;
    amount: number;
    transactionStatus: "APPROVED" | "REJECTED" | "PENDING";
    superiorUserName: string;
    name: string;
    withdrawalAmount: number;
    totalRechargeAmount: number;
    totalWithdrawalAmount: number;
    applicationTime: string;
    processingTime?: string;
    reviewRemark?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;               // mongodb field, optional

    // Almost always present
    withdrawMethod: "BankTransfer" | "MobileBanking";
}

// ─────────────────────────────────────────────────────────────────────────────
// Bank Transfer specific fields
// ─────────────────────────────────────────────────────────────────────────────
export interface BankTransferWithdrawal extends BaseWithdrawal {
    withdrawMethod: "BankTransfer";
    bankName?: string;
    bankAccountNumber?: string | number;   // sometimes comes as number, sometimes string
    branchName?: string;
    district?: string;

    // usually not present in bank transfer
    mobileBankingName?: never;
    mobileBankingAccountNumber?: never;
    mobileUserDistrict?: never;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Banking specific fields
// ─────────────────────────────────────────────────────────────────────────────
export interface MobileBankingWithdrawal extends BaseWithdrawal {
    withdrawMethod: "MobileBanking";
    mobileBankingName?: string;
    mobileBankingAccountNumber?: string | number;
    mobileUserDistrict?: string;

    // usually not present in mobile banking
    bankName?: never;
    bankAccountNumber?: never;
    branchName?: never;
    district?: never;
}

// ─────────────────────────────────────────────────────────────────────────────
// Final exported type (discriminated union)
// ─────────────────────────────────────────────────────────────────────────────
export type Withdrawal =
    | BankTransferWithdrawal
    | MobileBankingWithdrawal;