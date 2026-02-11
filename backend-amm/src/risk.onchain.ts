// backend-amm/src/risk.onchain.ts
import { Injectable } from "@nestjs/common";

interface BalanceMap {
  [user: string]: { [asset: string]: number };
}

@Injectable()
export class OnChainRiskEngine {
  private balances: BalanceMap = {};
  private maxLeverage = 3;

  setBalance(user: string, asset: string, amount: number) {
    if (!this.balances[user]) this.balances[user] = {};
    this.balances[user][asset] = amount;
  }

  preTradeCheck(user: string, side: "buy" | "sell", asset: string, size: number, price: number) {
    const bal = this.balances[user]?.[asset] || 0;

    if (side === "sell" && bal < size) {
      throw new Error("RISK: Insufficient balance");
    }

    const exposure = size * price;
    if (exposure > bal * this.maxLeverage) {
      throw new Error("RISK: Max leverage exceeded");
    }

    return true;
  }

  postTradeUpdate(buyer: string, seller: string, asset: string, size: number) {
    this.balances[buyer][asset] += size;
    this.balances[seller][asset] -= size;
  }
}
