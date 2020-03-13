import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenResponse {

   @ApiProperty()
   readonly expiresIn: string;

   @ApiProperty()
   readonly accessToken: string;
}
