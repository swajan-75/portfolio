import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

// Prisma 7 requires an explicit driver adapter — PrismaClient no longer
// reads DATABASE_URL on its own. Constructing the pg.Pool explicitly (rather
// than passing { connectionString } straight to PrismaPg) avoids a SASL
// "client password must be a string" auth failure against Prisma Postgres.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
