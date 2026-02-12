// matching-engine/parallel.ts
import { Worker } from "worker_threads";
import os from "os";

export type Order = {
  id: string;
  pair: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  timestamp: number;
};

export type Trade = {
  buyOrderId: string;
  sellOrderId: string;
  price: number;
  amount: number;
  pair: string;
};

type Job = { pair: string; orders: Order[] };

export class ParallelMatchingEngine {
  private workers: Worker[] = [];
  private queue: Job[] = [];
  private active = 0;

  constructor(private workerFile: string, private maxWorkers = os.cpus().length) {
    for (let i = 0; i < this.maxWorkers; i++) {
      const w = new Worker(workerFile);
      w.on("message", (trades: Trade[]) => this.onWorkerDone(trades));
      w.on("error", (e) => console.error("Worker error", e));
      this.workers.push(w);
    }
  }

  submit(pair: string, orders: Order[]) {
    this.queue.push({ pair, orders });
    this.dispatch();
  }

  private dispatch() {
    if (this.queue.length === 0) return;
    for (const w of this.workers) {
      if ((w as any)._busy) continue;
      const job = this.queue.shift();
      if (!job) return;
      (w as any)._busy = true;
      w.postMessage(job);
      this.active++;
    }
  }

  private onWorkerDone(trades: Trade[]) {
    // TODO: forward to settlement / ledger
    console.log("Matched trades:", trades.length);
    this.active--;
    this.dispatch();
  }
}
