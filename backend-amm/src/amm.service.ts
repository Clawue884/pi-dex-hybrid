import { Injectable } from "@nestjs/common";
import { SettlementEngine } from "./core/settlement.service";
import { DeterministicLedger } from "./core/ledger.service";
import { SignatureService, SignedOrder } from "./core/signature.service";

export interface Pool {
  pair: string;
  reserveA: number;
  reserveB: number;
  fee: number; // ex: 0.003
}

@Injectable()
export class AmmService {
  private pools: Map<string, Pool> = new Map();
  private ledger = new DeterministicLedger();
  private settlement = new SettlementEngine(this.ledger);

  constructor() {
    // contoh pool awal
    this.createPool("PI/USDT", 1_000_000, 314_000_000, 0.003);
  }

  createPool(pair: string, reserveA: number, reserveB: number, fee = 0.003) {
    this.pools.set(pair, { pair, reserveA, reserveB, fee });
  }

  getPool(pair: string): Pool {
    const pool = this.pools.get(pair);
    if (!pool) throw new Error("Pool not found");
    return pool;
  }

  quote(pair: string, amountIn: number, isAToB = true) {
    const pool = this.getPool(pair);
    const reserveIn = isAToB ? pool.reserveA : pool.reserveB;
    const reserveOut = isAToB ? pool.reserveB : pool.reserveA;

    const amountInWithFee = amountIn * (1 - pool.fee);
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn + amountInWithFee;
    return numerator / denominator;
  }

  swap(
    pair: string,
    signedOrder: SignedOrder,
    amountIn: number,
    minOut: number,
    isAToB: boolean,
    counterparty: SignedOrder,
    nonce: number
  ) {
    // 🔐 Signature validation
    if (!SignatureService.verifySignature(signedOrder)) {
      throw new Error("Invalid user signature");
    }

    const pool = this.getPool(pair);
    const amountOut = this.quote(pair, amountIn, isAToB);

    if (amountOut < minOut) {
      throw new Error("Slippage too high");
    }

    // Update reserves (x*y=k)
    if (isAToB) {
      pool.reserveA += amountIn;
      pool.reserveB -= amountOut;
    } else {
      pool.reserveB += amountIn;
      pool.reserveA -= amountOut;
    }

    // ⚡ Settlement (real ledger entry)
    const execution = {
      buyer: JSON.parse(signedOrder.payload).user,
      seller: JSON.parse(counterparty.payload).user,
      baseAsset: isAToB ? "A" : "B",
      quoteAsset: isAToB ? "B" : "A",
      baseAmount: amountOut,
      quoteAmount: amountIn,
      nonce
    };

    return this.settlement.executeTrade(
      signedOrder,
      counterparty,
      execution
    );
  }

  getStateHash() {
    return this.ledger.getStateHash();
  }

  getPools() {
    return Array.from(this.pools.values());
  }
}
