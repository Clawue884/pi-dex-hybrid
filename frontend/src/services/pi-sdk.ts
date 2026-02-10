// Pi SDK Service Wrapper

declare global {
  interface Window {
    Pi: any;
  }
}

export const PiSDK = {
  async authenticate() {
    if (!window.Pi) throw new Error("Pi SDK not loaded");

    return new Promise((resolve, reject) => {
      window.Pi.authenticate(
        ["username", "payments"],
        (auth: any) => resolve(auth),
        (err: any) => reject(err)
      );
    });
  },

  async requestPayment(amount: number, memo: string) {
    if (!window.Pi) throw new Error("Pi SDK not loaded");

    return new Promise((resolve, reject) => {
      window.Pi.createPayment(
        {
          amount,
          memo,
          metadata: { source: "pi-dex-hybrid" },
        },
        {
          onReadyForServerApproval(paymentId: string) {
            resolve(paymentId);
          },
          onCancel: (reason: any) => reject(reason),
          onError: (error: any) => reject(error),
        }
      );
    });
  },
};
