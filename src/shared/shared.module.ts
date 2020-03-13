import { Module } from '@nestjs/common';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AccountModule, AuthModule],
  exports: [AccountModule, AuthModule]
})
export class SharedModule { }
