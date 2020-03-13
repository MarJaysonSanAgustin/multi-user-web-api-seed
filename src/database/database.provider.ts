import { Logger } from '@nestjs/common';

import * as mongoose from 'mongoose';
import { createConnection, ConnectionOptions } from 'mongoose';

const dbLogger = new Logger('MongoDBProviders');

const connectionOptions: ConnectionOptions = {
   useNewUrlParser: true,
   useFindAndModify: false,
   useCreateIndex: true,
   useUnifiedTopology: true,
};

/**
 * Database Connection Factories
 */
export const databaseProviders = [
   {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
         (mongoose as any).Promise = global.Promise;

         const connection = await createConnection(process.env.MONGO_URL, connectionOptions);

         if (connection) {
            dbLogger.log('DATABASE_CONNECTION: Ready');
            return connection;
         }
      },
   },
];
