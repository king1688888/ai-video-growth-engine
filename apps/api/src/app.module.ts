import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AssetModule } from './asset/asset.module';
import { TaskModule } from './task/task.module';
import { BillingModule } from './billing/billing.module';
import { ReportModule } from './report/report.module';
import { ExportModule } from './export/export.module';
import { AdminModule } from './admin/admin.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    HealthModule,
    AuthModule,
    ProfileModule,
    AssetModule,
    TaskModule,
    BillingModule,
    ReportModule,
    ExportModule,
    AdminModule,
    QueueModule,
  ],
})
export class AppModule {}
