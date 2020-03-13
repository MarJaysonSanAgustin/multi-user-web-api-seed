import { Person } from './person.interface';
import { Document } from 'mongoose';
import { PagedRecord } from './paged-record.interface';

export interface IUserCustomer extends Person, Document {
   readonly customerHash: string;
}

export interface IUserCustomerPaged extends PagedRecord {
   readonly customersTotal: number;
   readonly customers: IUserCustomer[];
}
