import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
   imports: [DatabaseModule, SharedModule, UserModule],
   controllers: [AppController],
   providers: [],
})
export class AppModule { }
