import { useState } from "react";
import { PiSDK, PiUser } from "../services/pi-sdk";
import axios from "axios";

export function usePiWallet() {
  const [user, setUser] = useState<PiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async () => {
    const auth = await PiSDK.authenticate();
    setUser(auth.user);
    setToken(auth.accessToken);

    await axios.post("/api/auth/pi", {
      pi_uid: auth.user.uid,
      username: auth.user.username,
      accessToken: auth.accessToken,
    });

    return auth.user;
  };

  const pay = async (amount: number, memo: string) => {
    const paymentId = await PiSDK.createPayment(amount, memo);

    const res = await axios.post("/api/pi/approve-payment", {
      paymentId,
    });

    return res.data;
  };

  return { user, token, login, pay };
}
