// src/lib/data/products.ts

export interface Product {
  id: number;
  productId: number;
  name: string;
  introduction: string;
  commodityPrice: number;
  status: string;
  rejectRemarks: string;
  releaseTime: string;
}

export const products: Product[] = [
  {
    id: 1,
    productId: 111,
    name: "Skechers GO RUN",
    introduction: "The Skechers GO RUN series offers lightweight comfort...",
    commodityPrice: 10154211,
    status: "Ended",
    rejectRemarks: "",
    releaseTime: "2026-01-02 12:23:30",
  },
  {
    id: 2,
    productId: 110,
    name: "Skechers GO RUN",
    introduction: "The Skechers GO RUN series offers lightweight comfort...",
    commodityPrice: 9846512,
    status: "Ended",
    rejectRemarks: "",
    releaseTime: "2026-01-02 12:23:30",
  },
  {
    id: 3,
    productId: 109,
    name: "Skechers GO RUN",
    introduction: "The Skechers GO RUN series offers lightweight comfort...",
    commodityPrice: 9646582,
    status: "Ended",
    rejectRemarks: "",
    releaseTime: "2026-01-02 12:23:30",
  },
  {
    id: 4,
    productId: 108,
    name: "Skechers GO RUN",
    introduction: "The Skechers GO RUN series offers lightweight comfort...",
    commodityPrice: 9451385,
    status: "Ended",
    rejectRemarks: "",
    releaseTime: "2026-01-02 12:23:30",
  },
  {
    id: 5,
    productId: 107,
    name: "Skechers Slip-ins",
    introduction: "Put some glide in your stride with Skechers Slip-ins...",
    commodityPrice: 9215469,
    status: "Ended",
    rejectRemarks: "",
    releaseTime: "2026-01-02 12:23:30",
  },
  {
    id: 6,
    productId: 344,
    name: "Skechers Slip-ins",
    introduction: "Put some glide in your stride with Skechers Slip-ins...",
    commodityPrice: 9075000,
    status: "Ended",
    rejectRemarks: "",
    releaseTime: "2026-01-02 12:23:30",
  },
  {
    id: 7,
    productId: 106,
    name: "Skechers GO RUN",
    introduction: "The Skechers GO RUN series offers lightweight comfort...",
    commodityPrice: 9015426,
    status: "Ended",
    rejectRemarks: "",
    releaseTime: "2026-01-02 12:23:30",
  },
  {
    id: 8,
    productId: 104,
    name: "Skechers GO RUN",
    introduction: "The Skechers GO RUN series offers lightweight comfort...",
    commodityPrice: 8875491,
    status: "Ended",
    rejectRemarks: "",
    releaseTime: "2026-01-02 12:23:30",
  },
];
