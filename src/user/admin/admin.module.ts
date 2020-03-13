import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/shared/modules/auth/auth.module';
import { AccountModule } from 'src/shared/modules/account/account.module';

@Module({
  imports: [DatabaseModule, AuthModule, AccountModule],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule { }
