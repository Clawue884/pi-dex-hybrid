import { Controller, Post, Body } from "@nestjs/common";
import axios from "axios";

@Controller("auth/pi")
export class PiAuthController {
  @Post()
  async bindUser(@Body() body: any) {
    const { pi_uid, username, accessToken } = body;

    // Verify token with Pi API
    const res = await axios.get("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.data || res.data.uid !== pi_uid) {
      throw new Error("Invalid Pi Auth");
    }

    // TODO: Save to DB
    return { status: "OK", user: { pi_uid, username } };
  }
}
