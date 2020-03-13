import { Connection } from 'mongoose';
import { UserAdminSchema } from './schema/admin.schema';

export const adminProviders = [
   {
      provide: 'USER_ADMIN_MODEL',
      useFactory: (connection: Connection) => connection.model('user_admins', UserAdminSchema),
      inject: ['DATABASE_CONNECTION'],
   },
];
