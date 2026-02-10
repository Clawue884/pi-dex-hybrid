import { Controller, Post, Body } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Controller("kyc")
export class KycController {
  constructor(private users: UsersService) {}

  @Post("verify")
  async verify(@Body() body: any) {
    const { userId } = body;
    return this.users.setKycStatus(userId, "VERIFIED");
  }

  @Post("reject")
  async reject(@Body() body: any) {
    const { userId } = body;
    return this.users.setKycStatus(userId, "REJECTED");
  }
}
