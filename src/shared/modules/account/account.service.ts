import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { PassportLocalModel } from 'mongoose';

import { IAccount } from 'src/shared/interfaces/account.interface';
import { logThrowError } from 'src/shared/functions/log-throw-error';
import { CreateAccountDTO } from './dto/create-account.dto';
import { SetPasswordDTO } from './dto/set-password.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';

@Injectable()
export class AccountService {

   constructor(
      @Inject('ACCOUNT_MODEL') private readonly accountModel: PassportLocalModel<IAccount>,
   ) { }

   async create(createAccountDTO: CreateAccountDTO): Promise<IAccount> {
      try {

         const newAcc = new this.accountModel({
            username: createAccountDTO.email,
            role: createAccountDTO.role,
            profileId: createAccountDTO.profileId,
         });

         return await this.accountModel.register(newAcc, createAccountDTO.password);

      } catch (error) {
         logThrowError(error, AccountService.name);
      }
   }

   async setPassword(setPasswordDTO: SetPasswordDTO): Promise<IAccount> {
      try {

         const acc = await this.accountModel.findById(setPasswordDTO.accountId);
         await acc.setPassword(setPasswordDTO.newPassword);
         await acc.save();
         return acc;

      } catch (error) {
         logThrowError(error, AccountService.name);
      }
   }

   async changePassword(changePasswordDTO: ChangePasswordDTO): Promise<IAccount> {
      try {

         const account = await this.accountModel.findById(changePasswordDTO.accountId);
         if (!account) { throw new NotFoundException('Account not found.'); }

         await account.changePassword(changePasswordDTO.oldPassword, changePasswordDTO.newPassword);
         await account.save();
         return account;

      } catch (error) {
         logThrowError(error, AccountService.name);
      }
   }

   async findOne(query: object): Promise<IAccount> {
      try {
         return await this.accountModel.findOne({ ...query }).exec();
      } catch (error) {
         logThrowError(error, AccountService.name);
      }
   }

   async findById(id: string): Promise<IAccount> {
      try {
         return await this.accountModel.findById(id).exec();
      } catch (error) {
         logThrowError(error, AccountService.name);
      }
   }

}
