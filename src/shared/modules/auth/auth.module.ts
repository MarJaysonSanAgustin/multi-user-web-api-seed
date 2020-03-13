import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { IsAdminGuard } from './guards/admin-role.guard';
import { IsCustomerGuard } from './guards/customer-role.guard';
import { AuthService } from './auth.service';
import { AccountModule } from '../account/account.module';

@Module({
   imports: [
      DatabaseModule,
      AccountModule
   ],
   providers: [
      IsAdminGuard,
      IsCustomerGuard,
      AuthService
   ],
   exports: [
      IsAdminGuard,
      IsCustomerGuard
   ]
})
export class AuthModule { }
