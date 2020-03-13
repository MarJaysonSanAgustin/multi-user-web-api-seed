import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSignInDTO {

   @ApiProperty()
   @IsEmail()
   @IsNotEmpty()
   readonly email: string;

   @ApiProperty()
   @IsNotEmpty()
   @MinLength(6)
   readonly password: string;

}
