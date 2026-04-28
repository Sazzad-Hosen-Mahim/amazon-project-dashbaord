// src/lib/data/withdrawals.ts

export interface Withdrawal {
  id: number;
  userId: number;
  superiorName: string;
  operator: string;
  upiDistrict: string;
  ifscBranch: string;
  name: string;
  bankName: string;
  withdrawalAddress: string;
  mobileAreaCode: string;
  mobilePhone: string;
  orderNumber: string;
  withdrawalAmount: number;
  withdrawalFee: number;
  actualWithdrawalAmount: number;
  paymentChannel: string;
  actualUsdtAmount: number;
  totalRecharge: number;
  totalWithdrawal: number;
  applicationTime: string;
  processingTime: string;
  transactionStatus: string;
  reviewRemarks: string;
  balanceBefore: number;
  balanceAfter: number;
}

export const withdrawals: Withdrawal[] = [
  {
    id: 1,
    userId: 138334,
    superiorName: "BD Team 6 Leader",
    operator: "Admin01",
    upiDistrict: "UPI ID: user123@upi",
    ifscBranch: "HDFC0001234 / Delhi Branch",
    name: "Rahim Khan",
    bankName: "HDFC Bank",
    withdrawalAddress: "user123@upi",
    mobileAreaCode: "+880",
    mobilePhone: "1601974052",
    orderNumber: "WD20260102001",
    withdrawalAmount: 5000,
    withdrawalFee: 50,
    actualWithdrawalAmount: 4950,
    paymentChannel: "UPI",
    actualUsdtAmount: 0,
    totalRecharge: 15000,
    totalWithdrawal: 5000,
    applicationTime: "2026-01-02 10:15:22",
    processingTime: "2026-01-02 10:20:45",
    transactionStatus: "Successful",
    reviewRemarks: "",
    balanceBefore: 16752.65,
    balanceAfter: 11802.65,
  },
  {
    id: 2,
    userId: 138333,
    superiorName: "BD Team 6 Leader",
    operator: "Admin02",
    upiDistrict: "UPI ID: vipuser@okaxis",
    ifscBranch: "ICICI0005678 / Mumbai",
    name: "Ayesha Siddika",
    bankName: "ICICI Bank",
    withdrawalAddress: "vipuser@okaxis",
    mobileAreaCode: "+880",
    mobilePhone: "123654789",
    orderNumber: "WD20260102002",
    withdrawalAmount: 10000,
    withdrawalFee: 100,
    actualWithdrawalAmount: 9900,
    paymentChannel: "UPI",
    actualUsdtAmount: 0,
    totalRecharge: 280000,
    totalWithdrawal: 15000,
    applicationTime: "2026-01-02 14:30:10",
    processingTime: "",
    transactionStatus: "Processing",
    reviewRemarks: "Under review",
    balanceBefore: 270880.95,
    balanceAfter: 260980.95,
  },
  {
    id: 3,
    userId: 138331,
    superiorName: "BD Team 6 Leader",
    operator: "System",
    upiDistrict: "TRX Address",
    ifscBranch: "-",
    name: "Karim Ahmed",
    bankName: "USDT TRC20",
    withdrawalAddress: "TR7NHqjeKQxGTCuuP8qACi7c5LnMhCC3uX",
    mobileAreaCode: "+880",
    mobilePhone: "129129",
    orderNumber: "WD20260102003",
    withdrawalAmount: 200,
    withdrawalFee: 1,
    actualWithdrawalAmount: 199,
    paymentChannel: "USDT",
    actualUsdtAmount: 199,
    totalRecharge: 500,
    totalWithdrawal: 200,
    applicationTime: "2026-01-02 16:45:00",
    processingTime: "",
    transactionStatus: "Failed",
    reviewRemarks: "Insufficient balance",
    balanceBefore: 296104.46,
    balanceAfter: 296104.46,
  },
];
