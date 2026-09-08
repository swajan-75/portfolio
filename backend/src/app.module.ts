import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ProjectsModule } from './projects/projects.module';
import { UploadModule } from './upload/upload.module';
import { CvModule } from './cv/cv.module';
import { TrackingModule } from './tracking/tracking.module';
import { SkillsModule } from './skills/skills.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/winston.config';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    PrismaModule,
    ProfileModule,
    AuthModule,
    EmailModule,
    ProjectsModule,
    UploadModule,
    CvModule,
    TrackingModule,
    SkillsModule,
    WinstonModule.forRoot(winstonConfig),
    LogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
    },
  ],
})
export class AppModule {}
