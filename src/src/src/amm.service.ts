import { Injectable } from '@nestjs/common';

interface Pool {
  reserveA: number;
  reserveB: number;
}

@Injectable()
export class AmmService {
  private pool: Pool = { reserveA: 100000, reserveB: 100000 };

  getPool() {
    return this.pool;
  }

  addLiquidity(amountA: number, amountB: number) {
    this.pool.reserveA += amountA;
    this.pool.reserveB += amountB;
    return this.pool;
  }

  swapAforB(amountA: number) {
    const { reserveA, reserveB } = this.pool;
    const k = reserveA * reserveB;
    const newReserveA = reserveA + amountA;
    const newReserveB = k / newReserveA;
    const amountBOut = reserveB - newReserveB;
    this.pool = { reserveA: newReserveA, reserveB: newReserveB };
    return { amountBOut, pool: this.pool };
  }
}
