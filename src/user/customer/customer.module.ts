import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { customerProviders } from './customer.provider';

@Module({
  imports: [DatabaseModule, SharedModule],
  providers: [CustomerService, ...customerProviders],
  controllers: [CustomerController]
})
export class CustomerModule { }
