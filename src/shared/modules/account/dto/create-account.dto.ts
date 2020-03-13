import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDTO {

   @ApiProperty()
   @IsEmail()
   @IsNotEmpty()
   readonly email: string;

   role?: string;

   @ApiProperty()
   @IsNotEmpty()
   readonly profileId: string;

   @ApiProperty()
   @IsNotEmpty()
   readonly password: string;

   @ApiProperty()
   @IsNotEmpty()
   readonly passwordConfirmation: string;
}
