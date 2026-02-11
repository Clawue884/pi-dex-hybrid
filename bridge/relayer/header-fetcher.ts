// bridge/relayer/header-fetcher.ts
// Pull headers from Pi node & EVM node, push to respective light clients

import axios from "axios";

export async function fetchPiHeader(rpc: string, height: number) {
  const { data } = await axios.post(rpc, { method: "getBlockByHeight", params: [height] });
  return data;
}

export async function fetchEvmHeader(rpc: string, height: number) {
  const { data } = await axios.post(rpc, {
    jsonrpc: "2.0", id: 1, method: "eth_getBlockByNumber", params: ["0x" + height.toString(16), false]
  });
  return data.result;
}
