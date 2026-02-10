export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";

export class UserEntity {
  id!: string;
  pi_uid!: string;
  username!: string;
  wallet_address!: string;
  kyc_status!: KycStatus;
  created_at!: Date;
}
