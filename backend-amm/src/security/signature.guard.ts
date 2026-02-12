import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SignatureGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const sig = req.headers['x-signature'];
    const nonce = req.headers['x-nonce'];
    const timestamp = req.headers['x-timestamp'];
    const wallet = req.headers['x-wallet'];

    if (!sig || !nonce || !timestamp || !wallet) {
      throw new UnauthorizedException('Missing auth headers');
    }

    const now = Date.now();
    if (Math.abs(now - Number(timestamp)) > 60_000) {
      throw new UnauthorizedException('Expired timestamp');
    }

    const message = `${wallet}:${nonce}:${timestamp}:${JSON.stringify(req.body)}`;
    const hash = crypto.createHash('sha256').update(message).digest('hex');

    if (!this.verifySignature(wallet, hash, sig)) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }

  verifySignature(wallet: string, hash: string, signature: string): boolean {
    // 🔐 placeholder — nanti hubungkan ke Pi Wallet verify API
    return signature === crypto.createHash('sha256').update(wallet + hash).digest('hex');
  }
}
