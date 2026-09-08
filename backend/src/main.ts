// Must run before any other import: PrismaService reads process.env.DATABASE_URL
// at module load time (to build its pg.Pool), which is before Nest's DI graph
// or ConfigModule would otherwise populate it.
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.use(cookieParser());
  // Needed so req.ip resolves to the real client IP behind Vercel's proxy
  // (used by the tracking module for visitor hashing/geo lookup).
  app.set('trust proxy', 1);
  app.enableShutdownHooks();
  app.setGlobalPrefix('api/v1');
  // Bare enableCors() sends Access-Control-Allow-Origin: *, which browsers
  // reject when the frontend sets withCredentials: true — the Set-Cookie
  // from /otp/verify would silently never stick. Must be an explicit origin.
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('The Portfolio API documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
