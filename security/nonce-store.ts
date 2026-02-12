const usedNonces = new Map<string, Set<number>>();

export function checkAndUseNonce(address: string, nonce: number): boolean {
  if (!usedNonces.has(address)) usedNonces.set(address, new Set());
  const set = usedNonces.get(address)!;
  if (set.has(nonce)) return false;
  set.add(nonce);
  return true;
}
