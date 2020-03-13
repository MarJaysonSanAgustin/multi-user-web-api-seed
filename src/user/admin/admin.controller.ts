import {
   Controller,
   Post,
   Body,
   Res,
   UnprocessableEntityException,
   InternalServerErrorException,
   HttpStatus,
   UseGuards,
   NotFoundException,
   UnauthorizedException,
   Get,
   Req,
   Put,
   Query,
   ConflictException,
} from '@nestjs/common';
import {
   ApiTags,
   ApiBearerAuth,
   ApiCreatedResponse,
   ApiUnauthorizedResponse,
   ApiForbiddenResponse,
   ApiUnprocessableEntityResponse,
   ApiInternalServerErrorResponse,
   ApiQuery,
   ApiOkResponse,
   ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Response, Request } from 'express';

import { AccountService } from 'src/shared/modules/account/account.service';
import { AuthService } from 'src/shared/modules/auth/auth.service';
import { successReturn } from 'src/shared/functions/return-success';
import { logThrowError } from 'src/shared/functions/log-throw-error';
import { IsAdminGuard } from 'src/shared/modules/auth/guards/admin-role.guard';
import { UserSignUpDTO } from 'src/shared/dtos/user-signup.dto';
import { AdminService } from './admin.service';
import { UpdateUserProfileDTO } from 'src/shared/dtos/update-user-profile.dto';
import { UserSignInDTO } from 'src/shared/dtos/user-signin.dto';
import { Role } from 'src/shared/enums/user-role.enum';
import { JwtPayloadDecoded } from 'src/shared/interfaces/jwt.interface';
import { CreateUserProfileDTO } from 'src/shared/dtos/create-user-profile.dto';
import { AccessTokenResponse } from 'src/shared/classes/access-token';

@ApiTags('admins')
@Controller('admins')
export class AdminController {

   constructor(
      private readonly accountService: AccountService,
      private readonly authService: AuthService,
      private readonly adminService: AdminService,
   ) { }

   @Post()
   @UseGuards(AuthGuard('jwt'), IsAdminGuard)
   @ApiBearerAuth()
   @ApiCreatedResponse({ description: 'The admin record has been successfully created.' })
   @ApiUnauthorizedResponse({ description: 'Authentication token is required.' })
   @ApiForbiddenResponse({ description: 'Admin role is required.' })
   @ApiUnprocessableEntityResponse({ description: 'Invalid admin record object.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   async create(@Body() userSignUpDTO: UserSignUpDTO, @Res() res: Response) {
      try {

         if (await this.adminService.find({ email: userSignUpDTO.email })) {
            throw new ConflictException("Admin already exists.");
         }

         userSignUpDTO.role = 'admin';

         if (!this.authService.confirmPasswords(userSignUpDTO.password, userSignUpDTO.passwordConfirmation)) {
            throw new UnprocessableEntityException('Passwords should match.');
         }

         const adminProfile = await this.adminService.create(userSignUpDTO);
         if (!adminProfile) { throw new InternalServerErrorException('Unable to create admin profile.'); }

         const adminAccount = await this.accountService.create({ ...userSignUpDTO, profileId: adminProfile._id });
         if (!adminAccount) { throw new InternalServerErrorException('Unable to create admin account.'); }

         const successData = { message: 'Registration successful!' };
         return successReturn(res, successData, HttpStatus.CREATED);

      } catch (error) {
         logThrowError(error, AdminController.name);
      }
   }

   @Get()
   @UseGuards(AuthGuard('jwt'), IsAdminGuard)
   @ApiBearerAuth()
   @ApiQuery({ name: 'page', required: false, description: 'Pagination page' })
   @ApiQuery({ name: 'rows', required: false, description: 'Rows per page' })
   @ApiOkResponse({ description: 'Returns a paged-record object with an array of admin record.', type: UpdateUserProfileDTO, isArray: true })
   @ApiUnauthorizedResponse({ description: 'Authentication token is required.' })
   @ApiForbiddenResponse({ description: 'Admin role is required.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   async get(
      @Res() res: Response,
      @Query('page') page = '1',
      @Query('rows') rows = '10',
   ) {
      try {

         const pagedAdmins = await this.adminService.get(page, rows);
         return successReturn(res, pagedAdmins);

      } catch (error) {
         logThrowError(error, AdminController.name);
      }
   }

   @Post('access-token')
   @UseGuards(AuthGuard('local'))
   @ApiCreatedResponse({ description: 'The admin access token has been successfully created.', type: AccessTokenResponse })
   @ApiUnauthorizedResponse({ description: 'Invalid admin credentials.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   async signIn(@Body() userSignInDTO: UserSignInDTO, @Res() res: Response) {
      try {

         const user = await this.accountService.findOne({ username: userSignInDTO.email });

         if (!user) { throw new NotFoundException('Account not found.'); }
         if (!(user.role === Role.admin)) { throw new UnauthorizedException('Invalid email or password.'); }

         const successData = this.authService.createToken(user);
         return successReturn(res, successData, HttpStatus.OK);

      } catch (error) {
         logThrowError(error, AdminController.name);
      }
   }

   @Get('me/profile')
   @UseGuards(AuthGuard('jwt'), IsAdminGuard)
   @ApiBearerAuth()
   @ApiOkResponse({ description: 'Returns an admin profile.', type: CreateUserProfileDTO })
   @ApiUnauthorizedResponse({ description: 'Authentication token is required.' })
   @ApiForbiddenResponse({ description: 'Admin role is required.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   async getProfile(@Req() req: Request, @Res() res: Response) {
      try {

         const user = req.user as JwtPayloadDecoded;

         const adminAccount = await this.accountService.findById(user.id);
         if (!adminAccount) { throw new UnauthorizedException('Invalid account.'); }

         const adminProfile = await this.adminService.findById(adminAccount.profileId);
         return successReturn(res, adminProfile, HttpStatus.OK);

      } catch (error) {
         logThrowError(error, AdminController.name);
      }
   }

   @Put('me/profile')
   @UseGuards(AuthGuard('jwt'), IsAdminGuard)
   @ApiBearerAuth()
   @ApiOkResponse({ description: 'Returns an updated admin profile.', type: CreateUserProfileDTO })
   @ApiUnauthorizedResponse({ description: 'Authentication token is required.' })
   @ApiForbiddenResponse({ description: 'Admin role is required.' })
   @ApiUnprocessableEntityResponse({ description: 'Invalid admin record object.' })
   @ApiNotFoundResponse({ description: 'Admin profile record not found.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
   async updateProfile(@Req() req: Request, @Res() res: Response, @Body() updateAdminUserDTO: UpdateUserProfileDTO) {
      try {

         const user = req.user as JwtPayloadDecoded;

         const adminAccount = await this.accountService.findById(user.id);
         if (!adminAccount) { throw new UnauthorizedException('Invalid account.'); }

         const updatedAdminProfile = await this.adminService.update(adminAccount.profileId, updateAdminUserDTO);
         return successReturn(res, updatedAdminProfile, HttpStatus.OK);

      } catch (error) {
         logThrowError(error, AdminController.name);
      }
   }
}
