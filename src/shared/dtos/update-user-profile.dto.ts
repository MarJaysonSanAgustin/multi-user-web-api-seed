import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Gender } from '../../shared/enums/gender.enum';

export class UpdateUserProfileDTO {
   @ApiProperty()
   @IsNotEmpty()
   readonly firstName: string;

   @ApiProperty()
   @IsNotEmpty()
   readonly lastName: string;

   @ApiPropertyOptional({ enum: ['M', 'F', 'U'] })
   @IsOptional()
   readonly gender?: Gender;

   @ApiPropertyOptional()
   @IsOptional()
   readonly birthDate?: string;

   @ApiPropertyOptional()
   @IsOptional()
   readonly contactNumber?: string;
}
