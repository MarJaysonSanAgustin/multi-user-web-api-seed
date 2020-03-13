import { Connection } from 'mongoose';

import { CustomerSchema } from './schema/customer.schema';

export const customerProviders = [
   {
      provide: 'USER_CUSTOMER_MODEL',
      useFactory: (connection: Connection) => connection.model('user_customers', CustomerSchema),
      inject: ['DATABASE_CONNECTION'],
   },
];
