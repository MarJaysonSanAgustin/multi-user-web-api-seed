import { PassportLocalDocument } from 'mongoose';
import { Role } from '../enums/user-role.enum';

export interface IAccount extends PassportLocalDocument {
   readonly role: Role;
   readonly password: string;
   readonly passwordConfirmation: string;

   readonly username?: string;
   readonly profileId?: string;
   readonly isVerified?: boolean;

}
