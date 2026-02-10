import { Injectable } from "@nestjs/common";
import { UserEntity, KycStatus } from "./user.entity";

@Injectable()
export class UsersService {
  private users: Record<string, UserEntity> = {};

  async bindPiIdentity(data: {
    pi_uid: string;
    username: string;
    wallet_address: string;
  }): Promise<UserEntity> {
    let user = Object.values(this.users).find(
      (u) => u.pi_uid === data.pi_uid
    );

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        pi_uid: data.pi_uid,
        username: data.username,
        wallet_address: data.wallet_address,
        kyc_status: "PENDING",
        created_at: new Date(),
      };
      this.users[user.id] = user;
    }

    return user;
  }

  async setKycStatus(userId: string, status: KycStatus) {
    const user = this.users[userId];
    if (!user) throw new Error("User not found");

    user.kyc_status = status;
    return user;
  }

  async getByPiUid(pi_uid: string) {
    return Object.values(this.users).find((u) => u.pi_uid === pi_uid);
  }
}
