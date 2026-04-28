// src/lib/data/goldenEggs.ts

export interface GoldenEgg {
  id: number;
  userId: number;
  numberOfRewards: number;
  isUsed: "Yes" | "No";
  rewardType: "Amount" | "Multi task reward rate";
  startSingular: number;
  creationTime: string;
  usageTime: string;
}

export const goldenEggs: GoldenEgg[] = [
  {
    id: 1,
    userId: 138334,
    numberOfRewards: 500,
    isUsed: "Yes",
    rewardType: "Amount",
    startSingular: 15,
    creationTime: "2025-12-13 17:58:36",
    usageTime: "2025-12-13 22:57:55",
  },
  {
    id: 2,
    userId: 138333,
    numberOfRewards: 12,
    isUsed: "Yes",
    rewardType: "Multi task reward rate",
    startSingular: 25,
    creationTime: "2025-12-11 00:56:05",
    usageTime: "2025-12-11 00:56:40",
  },
  {
    id: 3,
    userId: 138333,
    numberOfRewards: 150,
    isUsed: "Yes",
    rewardType: "Amount",
    startSingular: 15,
    creationTime: "2025-12-11 00:21:18",
    usageTime: "2025-12-11 00:25:20",
  },
  {
    id: 4,
    userId: 138331,
    numberOfRewards: 12,
    isUsed: "Yes",
    rewardType: "Multi task reward rate",
    startSingular: 25,
    creationTime: "2025-12-06 19:47:43",
    usageTime: "2025-12-06 19:48:06",
  },
  {
    id: 5,
    userId: 138331,
    numberOfRewards: 150,
    isUsed: "Yes",
    rewardType: "Amount",
    startSingular: 15,
    creationTime: "2025-12-06 19:24:17",
    usageTime: "2025-12-06 19:32:47",
  },
  {
    id: 6,
    userId: 131294,
    numberOfRewards: 50000,
    isUsed: "Yes",
    rewardType: "Amount",
    startSingular: 15,
    creationTime: "2025-12-03 16:14:11",
    usageTime: "2025-12-03 16:26:46",
  },
  {
    id: 7,
    userId: 138328,
    numberOfRewards: 100,
    isUsed: "No",
    rewardType: "Amount",
    startSingular: 15,
    creationTime: "2025-12-03 02:22:21",
    usageTime: "2025-12-03 02:22:21",
  },
  {
    id: 8,
    userId: 138327,
    numberOfRewards: 100,
    isUsed: "Yes",
    rewardType: "Amount",
    startSingular: 19,
    creationTime: "2025-12-01 21:46:49",
    usageTime: "2025-12-01 21:47:20",
  },
  {
    id: 9,
    userId: 138325,
    numberOfRewards: 50,
    isUsed: "Yes",
    rewardType: "Amount",
    startSingular: 11,
    creationTime: "2025-12-01 20:44:33",
    usageTime: "2025-12-01 20:47:05",
  },
];