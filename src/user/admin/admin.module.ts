import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { SharedModule } from '../../shared/shared.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { adminProviders } from './admin.provider';

@Module({
  imports: [DatabaseModule, SharedModule],
  providers: [AdminService, ...adminProviders],
  controllers: [AdminController]
})
export class AdminModule { }
