import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { IAccount } from '../../interfaces/account.interface';
import { AccountService } from '../account/account.service';
import { JwtPayload } from '../../interfaces/jwt.interface';

@Injectable()
export class AuthService {

   constructor(private readonly accountService: AccountService) { }

   createToken(account: IAccount) {
      const expiresIn = process.env.APP_TOKEN_EXPIRATION;
      const secret = process.env.APP_SECRET;

      const accessToken = sign({
         id: account.id,
         email: account.username,
         role: account.role,
      }, secret, { expiresIn });

      return Object.freeze({ expiresIn, accessToken });
   }

   confirmPasswords(password: string, passwordConfirmation: string): boolean {
      return password === passwordConfirmation;
   }

   async validateUser(payload: JwtPayload): Promise<IAccount> {
      return await this.accountService.findOne({ _id: payload.id });
   }
}
