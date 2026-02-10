import axios from "axios";
import { PiSDK } from "../services/pi-sdk";

export function usePiIdentity() {
  const bindIdentity = async () => {
    const auth = await PiSDK.authenticate();

    const wallet_address = `pi_${auth.user.uid}`; // placeholder mapping

    const res = await axios.post("/api/identity/bind", {
      accessToken: auth.accessToken,
      pi_uid: auth.user.uid,
      username: auth.user.username,
      wallet_address,
    });

    return res.data.user;
  };

  return { bindIdentity };
}
