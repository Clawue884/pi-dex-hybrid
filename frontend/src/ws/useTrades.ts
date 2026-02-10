import { useEffect } from "react";
import { io } from "socket.io-client";

export function useTradeSocket(onSettled: (data: any) => void) {
  useEffect(() => {
    const socket = io("http://localhost:3000"); // ws backend-amm

    socket.on("trade:settled", (data) => {
      onSettled(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [onSettled]);
}
