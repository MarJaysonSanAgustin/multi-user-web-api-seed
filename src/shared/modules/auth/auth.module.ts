import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { AccountModule } from '../account/account.module';
import { IsAdminGuard } from './guards/admin-role.guard';
import { IsCustomerGuard } from './guards/customer-role.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';

@Module({
   imports: [
      DatabaseModule,
      AccountModule
   ],
   providers: [
      IsAdminGuard,
      IsCustomerGuard,

      LocalStrategy,
      JwtStrategy,

      AuthService,
   ],
   exports: [
      IsAdminGuard,
      IsCustomerGuard,

      LocalStrategy,
      JwtStrategy,

      AuthService,
   ]
})
export class AuthModule { }
