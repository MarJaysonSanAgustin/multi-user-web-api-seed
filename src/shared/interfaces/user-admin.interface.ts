import { Person } from './person.interface';
import { Document } from 'mongoose';
import { PagedRecord } from './paged-record.interface';

export interface IUserAdmin extends Person, Document {
   readonly adminHash: string;
}

export interface IUserAdminPaged extends PagedRecord {
   readonly adminsTotal: number;
   readonly admins: IUserAdmin[];
}
