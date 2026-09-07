import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../../prisma.service';

function cookieExtractor(req: Request): string | null {
  return (req?.cookies?.access_token as string | undefined) ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Cookie-first: the frontend authenticates via an httpOnly cookie
      // (withCredentials: true, no Authorization header ever sent). The
      // bearer extractor is kept only as a fallback for Swagger "Try it out".
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secret_jwt_key_change_me',
    });
  }

  async validate(payload: any) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: payload.email },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email };
  }
}
