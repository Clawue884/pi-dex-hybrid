// backend-amm/src/oracle.twap.ts
import { Injectable } from "@nestjs/common";

interface PricePoint {
  price: number;
  timestamp: number;
}

@Injectable()
export class OracleTWAP {
  private prices: Record<string, PricePoint[]> = {};

  recordPrice(pair: string, price: number) {
    if (!this.prices[pair]) this.prices[pair] = [];
    this.prices[pair].push({ price, timestamp: Date.now() });

    // Keep only last 5 minutes
    this.prices[pair] = this.prices[pair].filter(
      p => Date.now() - p.timestamp < 5 * 60 * 1000
    );
  }

  getTWAP(pair: string): number {
    const data = this.prices[pair] || [];
    if (!data.length) return 0;

    const sum = data.reduce((acc, p) => acc + p.price, 0);
    return sum / data.length;
  }
}
