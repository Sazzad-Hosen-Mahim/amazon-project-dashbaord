// src/lib/data/singleNumbers.ts

export interface SingleNumber {
  id: number;
  userId: number;
  singleNumber: number;
  startSingular: number;
  commodityPrice: number;
}

export const singleNumbers: SingleNumber[] = [
  {
    id: 1,
    userId: 138334,
    singleNumber: 135,
    startSingular: 6,
    commodityPrice: 29139,
  },
];

// src/lib/data/commodities.ts

export interface Commodity {
  id: number;
  productPrice: number;
  productId: number;
  productName: string;
  productIntroduction: string;
}

export const commodities: Commodity[] = [
  {
    id: 1,
    productPrice: 10154211,
    productId: 111,
    productName: "Skechers GO RUN Speed Elite Hyper",
    productIntroduction:
      "The Skechers GO RUN Speed Elite Hyper is a lightweight, high-performance shoe with HYPER BURST® cushioning and a carbon-infused plate for speed, propulsion, and excellent traction during fast runs.",
  },
  {
    id: 2,
    productPrice: 9846512,
    productId: 110,
    productName: "Skechers GO RUN Razor Excess",
    productIntroduction:
      "Responsive and durable running shoe designed for daily training and long-distance runs.",
  },
];