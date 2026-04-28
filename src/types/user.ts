export interface AssignedProductState {
  productId: string; // This is the _id from product
  name: string;
  price: string;
  commission: string;
  isExisting?: boolean;
  productItemId?: string;
}

export interface User {
    _id: string;
    userId: number;
    score: number;
    phoneNumber: string;
    email?: string;
    role: string;
    password: string;
    invitationCode: string;
    superiorUserId: string;
    superiorUserName: string;
    userDiopsitType: string;
    orderRound: {
        round: string;
        status: boolean;
        _id: string;
    };
    level: number;
    outOfBalance: number;
    freezeUser: boolean;
    freezeWithdraw: boolean;
    quantityOfOrders: number;
    completedOrdersCount: number;
    adminAssaignProductsOrRewards: Array<{
        productId: number;
        orderNumber: number;
        _id: string;
    }>;
    withdrawalAddressAndMethod: {
        _id: string;
        name: string;
        withdrawMethod: "BankTransfer" | "MobileBanking";
        // Bank Transfer fields
        bankName?: string;
        bankAccountNumber?: number;
        branchName?: string;
        district?: string;
        // Mobile Banking fields
        mobileBankingName?: string;
        mobileBankingAccountNumber?: number;
    } | null;
    withdrowalValidOddNumber: number;
    actualCompletedNumberToday: number;
    userBalance: number;
    memberTotalRecharge: number;
    memberTotalWithdrawal: number;
    userOrderFreezingAmount: number;
    amountFrozedInWithdrawal: number;
    whetherOnline: boolean;
    userType: string;
    lastLoginIp: string;
    userOrderAmountSlot: number[];
    completedOrderProducts: string[];
    isOnline: boolean;
    shareableLink?: string;
    adminAssaignProducts: Array<{
        productId: number;
        orderNumber: number;
        _id: string;
    }>;
    assainProductsIds?: {
        _id: string;
        userId: number;
        type: string;
        products: Array<{
            productId: string;
            price: number;
            commission: number;
            status: string;
            _id: string;
            name?: string;
        }>;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
    name?: string;
    userSelectedPackage?: number;
}