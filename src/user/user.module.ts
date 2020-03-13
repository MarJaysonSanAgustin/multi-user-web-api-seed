import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AdminModule, CustomerModule],
  exports: [AdminModule, CustomerModule]
})
export class UserModule { }
