import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request as Req } from 'express';
import { JwtPayload } from '../../../interfaces/jwt.interface';
import { logThrowError } from 'src/shared/functions/log-throw-error';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      private readonly authService: AuthService,
   ) {

      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: process.env.APP_SECRET,
      });

   }

   async validate(payload: JwtPayload, @Request() req: Req) {

      const user = await this.authService.validateUser(payload);
      if (!user) { logThrowError(new UnauthorizedException('Invalid email or password.'), JwtStrategy.name); }

      req.user = payload;
      return payload;
   }

}
