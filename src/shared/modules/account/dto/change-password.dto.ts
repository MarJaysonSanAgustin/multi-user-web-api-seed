import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, MinLength } from 'class-validator';

export class ChangePasswordDTO {

   @ApiProperty()
   @IsNotEmpty()
   @IsMongoId()
   readonly accountId: string;

   @ApiProperty()
   @IsNotEmpty()
   @MinLength(6)
   readonly oldPassword: string;

   @ApiProperty()
   @IsNotEmpty()
   @MinLength(6)
   readonly newPassword: string;
}
