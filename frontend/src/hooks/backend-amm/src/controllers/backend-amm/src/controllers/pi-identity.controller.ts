import { Controller, Post, Body } from "@nestjs/common";
import axios from "axios";
import { UsersService } from "../users/users.service";

@Controller("identity")
export class PiIdentityController {
  constructor(private users: UsersService) {}

  @Post("bind")
  async bind(@Body() body: any) {
    const { accessToken, pi_uid, username, wallet_address } = body;

    // Verify Pi token
    const res = await axios.get("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.data.uid !== pi_uid) {
      throw new Error("Invalid Pi identity");
    }

    // Bind identity
    const user = await this.users.bindPiIdentity({
      pi_uid,
      username,
      wallet_address,
    });

    return { status: "OK", user };
  }
}
