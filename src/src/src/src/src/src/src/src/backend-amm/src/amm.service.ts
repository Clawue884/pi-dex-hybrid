import { Injectable } from '@nestjs/common';

interface Pool {
  tokenA: string;
  tokenB: string;
  reserveA: number;
  reserveB: number;
}

@Injectable()
export class AmmService {
  private feeRate = 0.003;
  private pools: Pool[] = [
    { tokenA: 'PI', tokenB: 'USDT', reserveA: 100000, reserveB: 100000 },
  ];

  getPools() {
    return this.pools;
  }

  addLiquidity(tokenA: string, tokenB: string, amountA: number, amountB: number) {
    let pool = this.pools.find(p => p.tokenA === tokenA && p.tokenB === tokenB);
    if (!pool) {
      pool = { tokenA, tokenB, reserveA: 0, reserveB: 0 };
      this.pools.push(pool);
    }
    pool.reserveA += amountA;
    pool.reserveB += amountB;
    return pool;
  }

  quote(tokenIn: string, tokenOut: string, amountIn: number) {
    const pool = this.pools.find(p => p.tokenA === tokenIn && p.tokenB === tokenOut);
    if (!pool) throw new Error('Pool not found');

    const amountInWithFee = amountIn * (1 - this.feeRate);
    const k = pool.reserveA * pool.reserveB;
    const newReserveA = pool.reserveA + amountInWithFee;
    const newReserveB = k / newReserveA;
    const amountOut = pool.reserveB - newReserveB;
    const priceImpact = amountOut / pool.reserveB;

    return { amountOut, priceImpact };
  }

  swap(tokenIn: string, tokenOut: string, amountIn: number) {
    const pool = this.pools.find(p => p.tokenA === tokenIn && p.tokenB === tokenOut);
    if (!pool) throw new Error('Pool not found');

    const { amountOut, priceImpact } = this.quote(tokenIn, tokenOut, amountIn);
    const amountInWithFee = amountIn * (1 - this.feeRate);

    pool.reserveA += amountInWithFee;
    pool.reserveB -= amountOut;

    console.log('[AMM EVENT] Swap', { tokenIn, tokenOut, amountIn, amountOut, priceImpact });
    return { amountOut, priceImpact, pool };
  }
}
