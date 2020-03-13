import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { PassportLocalModel } from 'mongoose';
import { IAccount } from '../../../interfaces/account.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
   constructor(
      @Inject('ACCOUNT_MODEL') private readonly accountModel: PassportLocalModel<IAccount>,
   ) {
      super({
         usernameField: 'email',
         passwordField: 'password',
      }, accountModel.authenticate());
   }
}