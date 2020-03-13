import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/shared/modules/auth/auth.module';
import { AccountModule } from 'src/shared/modules/account/account.module';

@Module({
  imports: [DatabaseModule, AuthModule, AccountModule],
  providers: [CustomerService],
  controllers: [CustomerController]
})
export class CustomerModule { }
