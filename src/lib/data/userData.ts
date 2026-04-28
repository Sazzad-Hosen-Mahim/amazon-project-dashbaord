// src/lib/data/users.ts

export interface User {
  userId: number;
  mobilePhone: number;
  invitationCode: string;
  superiorId: number;
  superiorName: string;
  userLevel: string;
  quantityOrders: number;
  withdrawalValidOdd: number;
  actualCompletedToday: number;
  userBalance: number;
  mobileTotalRecharge: number;
  membersTotalWithdrawal: number;
  orderFreezingAmount: number;
  frozenWithdrawalAmount: number;
  onlineStatus: string;
  whetherFreeze: string;
  mobileAreaCode: string;
  avatar: string;
  experienceGold: number;
  email: string;
  totalSubordinates: number;
  registrationTime: string;
  lastLoginAddress: string;
  lastLoginIp: string;
  lastLoginTime: string;
  userType: string;
}

export const users: User[] = [
  {
    userId: 138334,
    mobilePhone: 1601974052,
    invitationCode: "2HZIB7",
    superiorId: 127830,
    superiorName: "BD Team 6 ...",
    userLevel: "VIP 1",
    quantityOrders: 6,
    withdrawalValidOdd: 30,
    actualCompletedToday: 0,
    userBalance: 11752.65,
    mobileTotalRecharge: 110,
    membersTotalWithdrawal: 0,
    orderFreezingAmount: 0,
    frozenWithdrawalAmount: 0,
    onlineStatus: "Online",
    whetherFreeze: "No",
    mobileAreaCode: "+880",
    avatar: "",
    experienceGold: 500,
    email: "user1@example.com",
    totalSubordinates: 12,
    registrationTime: "2025-06-15 10:30:00",
    lastLoginAddress: "Dhaka, Bangladesh",
    lastLoginIp: "103.112.53.21",
    lastLoginTime: "2025-12-30 22:45:00",
    userType: "Normal",
  },
  {
    userId: 138333,
    mobilePhone: 123654789,
    invitationCode: "2HZIB6",
    superiorId: 127830,
    superiorName: "BD Team 6 ...",
    userLevel: "VIP 3",
    quantityOrders: 0,
    withdrawalValidOdd: 25,
    actualCompletedToday: 0,
    userBalance: 270880.95,
    mobileTotalRecharge: 1684,
    membersTotalWithdrawal: 5000,
    orderFreezingAmount: 200,
    frozenWithdrawalAmount: 100,
    onlineStatus: "Offline",
    whetherFreeze: "No",
    mobileAreaCode: "+880",
    avatar: "",
    experienceGold: 1200,
    email: "",
    totalSubordinates: 45,
    registrationTime: "2025-05-20 14:20:00",
    lastLoginAddress: "Chittagong, Bangladesh",
    lastLoginIp: "203.76.124.88",
    lastLoginTime: "2025-12-29 18:10:00",
    userType: "VIP",
  },
  {
    userId: 138332,
    mobilePhone: 1711651415,
    invitationCode: "2HZIB5",
    superiorId: 127834,
    superiorName: "BD Team 1 RH",
    userLevel: "VIP 0",
    quantityOrders: 0,
    withdrawalValidOdd: 0,
    actualCompletedToday: 0,
    userBalance: 0,
    mobileTotalRecharge: 0,
    membersTotalWithdrawal: 0,
    orderFreezingAmount: 0,
    frozenWithdrawalAmount: 0,
    onlineStatus: "Offline",
    whetherFreeze: "Yes",
    mobileAreaCode: "+880",
    avatar: "",
    experienceGold: 0,
    email: "",
    totalSubordinates: 0,
    registrationTime: "2025-07-10 09:15:00",
    lastLoginAddress: "",
    lastLoginIp: "",
    lastLoginTime: "2025-12-20 11:00:00",
    userType: "Normal",
  },
  {
    userId: 138331,
    mobilePhone: 129129,
    invitationCode: "2HZIB4",
    superiorId: 127830,
    superiorName: "BD Team 6 ...",
    userLevel: "VIP 3",
    quantityOrders: 7,
    withdrawalValidOdd: 32,
    actualCompletedToday: 0,
    userBalance: 296104.46,
    mobileTotalRecharge: 199,
    membersTotalWithdrawal: 1500,
    orderFreezingAmount: 300,
    frozenWithdrawalAmount: 50,
    onlineStatus: "Online",
    whetherFreeze: "No",
    mobileAreaCode: "+880",
    avatar: "",
    experienceGold: 800,
    email: "vipuser@example.com",
    totalSubordinates: 28,
    registrationTime: "2025-04-12 16:45:00",
    lastLoginAddress: "Sylhet, Bangladesh",
    lastLoginIp: "45.64.132.56",
    lastLoginTime: "2025-12-31 09:20:00",
    userType: "VIP",
  },
  {
    userId: 138330,
    mobilePhone: 1846105462,
    invitationCode: "2HZIB3",
    superiorId: 127830,
    superiorName: "BD Team 6 ...",
    userLevel: "VIP 0",
    quantityOrders: 0,
    withdrawalValidOdd: 0,
    actualCompletedToday: 0,
    userBalance: 0,
    mobileTotalRecharge: 108,
    membersTotalWithdrawal: 0,
    orderFreezingAmount: 0,
    frozenWithdrawalAmount: 0,
    onlineStatus: "Offline",
    whetherFreeze: "No",
    mobileAreaCode: "+880",
    avatar: "",
    experienceGold: 100,
    email: "",
    totalSubordinates: 3,
    registrationTime: "2025-08-05 12:00:00",
    lastLoginAddress: "",
    lastLoginIp: "",
    lastLoginTime: "2025-11-15 14:30:00",
    userType: "Normal",
  },
];
