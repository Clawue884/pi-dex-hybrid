export class HybridRouter {
  route(order: any) {
    if (order.type === 'market') {
      return { engine: 'AMM', payload: order };
    }

    if (order.type === 'limit') {
      return { engine: 'CLOB', payload: order };
    }

    if (order.amount > 100_000) {
      return { engine: 'HYBRID_SPLIT', payload: order };
    }

    return { engine: 'AMM', payload: order };
  }
}
