import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import geoip from 'geoip-lite';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  // Never store a raw IP — hash it with a server-side salt so the log is
  // anonymous but still lets us dedupe unique visitors.
  private hashVisitorId(ip: string): string {
    return crypto
      .createHash('sha256')
      .update(`${ip}:${process.env.VISITOR_HASH_SALT || ''}`)
      .digest('hex');
  }

  private resolveCountry(ip: string): string | undefined {
    const countryCode = geoip.lookup(ip)?.country;
    if (!countryCode) return undefined;
    try {
      // geoip-lite only returns the ISO alpha-2 code; Intl.DisplayNames
      // (built into Node's ICU) converts it to a display name with no
      // extra dependency.
      return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode);
    } catch {
      return countryCode;
    }
  }

  async recordVisit(ip: string) {
    await this.prisma.visitLog.create({
      data: {
        visitorId: this.hashVisitorId(ip),
        country: this.resolveCountry(ip),
      },
    });
  }

  async recordDownload() {
    await this.prisma.downloadLog.create({ data: {} });
  }

  async getStats() {
    const [visitors, cvDownloads, byCountry] = await Promise.all([
      this.prisma.visitLog.findMany({
        distinct: ['visitorId'],
        select: { visitorId: true },
      }),
      this.prisma.downloadLog.count(),
      this.prisma.visitLog.groupBy({
        by: ['country'],
        _count: { _all: true },
        where: { country: { not: null } },
      }),
    ]);

    return {
      unique_visitors: visitors.length,
      cv_downloads: cvDownloads,
      countries: Object.fromEntries(
        byCountry.map((c) => [c.country as string, c._count._all]),
      ),
    };
  }
}
