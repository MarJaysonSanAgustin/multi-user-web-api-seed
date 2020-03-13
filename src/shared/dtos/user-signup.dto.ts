import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class UserSignUpDTO {
   @ApiProperty()
   @IsNotEmpty()
   readonly firstName: string;

   @ApiProperty()
   @IsNotEmpty()
   readonly lastName: string;

   @ApiProperty()
   @IsNotEmpty()
   @IsEmail()
   readonly email: string;

   @ApiPropertyOptional({ enum: ['M', 'F', 'U'] })
   @IsOptional()
   readonly gender?: Gender;

   @ApiPropertyOptional()
   @IsOptional()
   readonly birthDate?: string;

   @ApiPropertyOptional()
   @IsOptional()
   readonly contactNumber?: string;

   role?: string;

   @ApiProperty()
   @IsNotEmpty()
   readonly password: string;

   @ApiProperty()
   @IsNotEmpty()
   readonly passwordConfirmation: string;
}
