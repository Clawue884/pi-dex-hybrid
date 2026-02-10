import { useState } from "react";
import { PiSDK } from "../services/pi-sdk";

export function usePiWallet() {
  const [user, setUser] = useState<any>(null);

  const login = async () => {
    const auth = await PiSDK.authenticate();
    setUser(auth.user);
    return auth.user;
  };

  const pay = async (amount: number, memo: string) => {
    return PiSDK.requestPayment(amount, memo);
  };

  return { user, login, pay };
}
