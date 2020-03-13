import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';

@Module({
   imports: [DatabaseModule, SharedModule],
   controllers: [AppController],
   providers: [],
})
export class AppModule { }
