import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { UpdateUserProfileDTO } from './update-user-profile.dto';

export class CreateUserProfileDTO extends UpdateUserProfileDTO {

   @ApiProperty()
   @IsNotEmpty()
   @IsEmail()
   readonly email: string;

}
