import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsMongoId } from 'class-validator';

export class SetPasswordDTO {

   @ApiProperty()
   @IsNotEmpty()
   @IsMongoId()
   readonly accountId: string;

   @ApiProperty()
   @IsNotEmpty()
   @MinLength(6)
   readonly newPassword: string;
}
