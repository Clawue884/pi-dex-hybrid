import crypto from "crypto";

export class MevGuardBatcher {
  batchOrders(orders: any[]) {
    // anonymize
    const anonymized = orders.map(o => ({
      ...o,
      wallet: crypto.createHash("sha256").update(o.wallet).digest("hex"),
    }));

    // deterministic sort
    anonymized.sort((a, b) =>
      crypto.createHash("sha256").update(JSON.stringify(a)).digest("hex")
        .localeCompare(
          crypto.createHash("sha256").update(JSON.stringify(b)).digest("hex")
        )
    );

    return anonymized;
  }
}
