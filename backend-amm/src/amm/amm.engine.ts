export class AmmEngine {
  executeSwap(pool, amountIn) {
    const { x, y } = pool;
    const k = x * y;
    const newX = x + amountIn;
    const newY = k / newX;
    const amountOut = y - newY;

    return { amountOut, newX, newY };
  }
}
