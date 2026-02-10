export function useKycGuard(user: any) {
  if (!user) return { allowed: false, reason: "NOT_LOGGED_IN" };
  if (user.kyc_status !== "VERIFIED")
    return { allowed: false, reason: "KYC_NOT_VERIFIED" };

  return { allowed: true };
}
