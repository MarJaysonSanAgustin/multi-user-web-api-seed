import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { accountProviders } from './account.provider';
import { AccountService } from './account.service';

@Module({
   imports: [
      DatabaseModule,
   ],
   providers: [
      AccountService,
      ...accountProviders,
   ],
   exports: [
      AccountService,
      ...accountProviders,
   ]
})
export class AccountModule { }
