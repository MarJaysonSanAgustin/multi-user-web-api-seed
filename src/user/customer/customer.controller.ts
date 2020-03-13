import { Controller, Post, Body, Res, ConflictException, ForbiddenException, InternalServerErrorException, HttpStatus, Get, UseGuards, Query, Param, NotFoundException, UnauthorizedException, Req, Put } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiUnprocessableEntityResponse, ApiInternalServerErrorResponse, ApiConflictResponse, ApiBearerAuth, ApiQuery, ApiOkResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam, ApiNotFoundResponse } from '@nestjs/swagger';
import { AccountService } from 'src/shared/modules/account/account.service';
import { CustomerService } from './customer.service';
import { AuthService } from 'src/shared/modules/auth/auth.service';
import { CreateUserProfileDTO } from 'src/shared/dtos/create-user-profile.dto';
import { UserSignUpDTO } from 'src/shared/dtos/user-signup.dto';
import { Response, Request } from 'express';
import { successReturn } from 'src/shared/functions/return-success';
import { logThrowError } from 'src/shared/functions/log-throw-error';
import { AuthGuard } from '@nestjs/passport';
import { IsAdminGuard } from 'src/shared/modules/auth/guards/admin-role.guard';
import { AccessTokenResponse } from 'src/shared/classes/access-token';
import { Role } from 'src/shared/enums/user-role.enum';
import { IsCustomerGuard } from 'src/shared/modules/auth/guards/customer-role.guard';
import { JwtPayloadDecoded } from 'src/shared/interfaces/jwt.interface';
import { UpdateUserProfileDTO } from 'src/shared/dtos/update-user-profile.dto';
import { UserSignInDTO } from 'src/shared/dtos/user-signin.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {

   constructor(
      private readonly accountService: AccountService,
      private readonly customerService: CustomerService,
      private readonly authService: AuthService,
   ) { }

   @Post()
   @ApiCreatedResponse({ description: 'The customer record has been successfully created.', type: CreateUserProfileDTO })
   @ApiUnprocessableEntityResponse({ description: 'Invalid customer record object.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   @ApiConflictResponse({ description: "Customer already exists. Login instead." })
   async signUp(@Body() userSignUpDTO: UserSignUpDTO, @Res() res: Response) {
      try {

         if (await this.customerService.find({ email: userSignUpDTO.email })) {
            throw new ConflictException("Customer already exists. Login instead.");
         }

         userSignUpDTO.role = 'customer';

         if (!this.authService.confirmPasswords(userSignUpDTO.password, userSignUpDTO.passwordConfirmation)) {
            throw new ForbiddenException('Passwords should match.');
         }

         const customerProfile = await this.customerService.create(userSignUpDTO);
         if (!customerProfile) { throw new InternalServerErrorException('Unable to create customer profile.'); }

         const customerAccount = await this.accountService.create({ ...userSignUpDTO, profileId: customerProfile._id });
         if (!customerAccount) { throw new InternalServerErrorException('Unable to create customer account.'); }

         const successData = { message: 'Registration successful!' };
         return successReturn(res, successData, HttpStatus.CREATED);

      } catch (error) {
         logThrowError(error, CustomerController.name);
      }
   }

   @Get()
   @UseGuards(AuthGuard('jwt'), IsAdminGuard)
   @ApiBearerAuth()
   @ApiQuery({ name: 'page', required: false, description: 'Pagination page' })
   @ApiQuery({ name: 'rows', required: false, description: 'Rows per page' })
   @ApiOkResponse({ description: 'Returns an array of customer records.', type: CreateUserProfileDTO, isArray: true })
   @ApiUnauthorizedResponse({ description: 'Authentication token is required.' })
   @ApiForbiddenResponse({ description: 'Admin role is required.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   async get(
      @Res() res: Response,
      @Query('page') page = '1',
      @Query('rows') rows = '10',
   ) {
      try {

         const customersPaged = await this.customerService.get(page, rows);
         return successReturn(res, customersPaged, HttpStatus.OK);

      } catch (error) {
         logThrowError(error, CustomerController.name);
      }
   }

   @Get(':id')
   @UseGuards(AuthGuard('jwt'), IsAdminGuard)
   @ApiBearerAuth()
   @ApiParam({ name: 'id', description: 'customer id' })
   @ApiOkResponse({ description: 'Returns a single customer record retrieved through it\' id.', type: CreateUserProfileDTO })
   @ApiUnauthorizedResponse({ description: 'Authentication token is required.' })
   @ApiForbiddenResponse({ description: 'Admin role is required.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   async getById(
      @Res() res: Response,
      @Param('id') customerId: string,
   ) {
      try {

         const customersPaged = await this.customerService.findById(customerId);
         return successReturn(res, customersPaged, HttpStatus.OK);

      } catch (error) {
         logThrowError(error, CustomerController.name);
      }
   }

   @Post('access-token')
   @UseGuards(AuthGuard('local'))
   @ApiCreatedResponse({ description: 'The customer access token has been successfully created.', type: AccessTokenResponse })
   @ApiUnauthorizedResponse({ description: 'Invalid customer credentials.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   async signIn(@Body() userSignInDTO: UserSignInDTO, @Res() res: Response) {
      try {

         const user = await this.accountService.findOne({ username: userSignInDTO.email });

         if (!user) { throw new NotFoundException('Account not found.'); }
         if (!(user.role === Role.customer)) { throw new UnauthorizedException('Invalid email or password.'); }

         const successData = this.authService.createToken(user);
         return successReturn(res, successData, HttpStatus.OK);

      } catch (error) {
         logThrowError(error, CustomerController.name);
      }
   }

   @Get('me/profile')
   @UseGuards(AuthGuard('jwt'), IsCustomerGuard)
   @ApiBearerAuth()
   @ApiOkResponse({ description: 'Returns a customer profile record owned by the customer.', type: CreateUserProfileDTO })
   @ApiUnauthorizedResponse({ description: 'Authentication token is required.' })
   @ApiForbiddenResponse({ description: 'Customer role is required.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   async getProfile(@Req() req: Request, @Res() res: Response) {
      try {

         const user = req.user as JwtPayloadDecoded;

         const customerAccount = await this.accountService.findById(user.id);
         if (!customerAccount) { throw new UnauthorizedException('Invalid account.'); }

         const customerProfile = await this.customerService.findById(customerAccount.profileId);
         return successReturn(res, customerProfile, HttpStatus.OK);

      } catch (error) {
         logThrowError(error, CustomerController.name);
      }
   }

   @Put('me/profile')
   @UseGuards(AuthGuard('jwt'), IsCustomerGuard)
   @ApiBearerAuth()
   @ApiOkResponse({ description: 'Returns an updated customer profile record owned by the customer.', type: CreateUserProfileDTO })
   @ApiUnauthorizedResponse({ description: 'Authentication token is required.' })
   @ApiForbiddenResponse({ description: 'Customer role is required.' })
   @ApiNotFoundResponse({ description: 'Customer profile record not found.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
   async updateProfile(@Req() req: Request, @Res() res: Response, @Body() updateCustomerUserDTO: UpdateUserProfileDTO) {
      try {

         const user = req.user as JwtPayloadDecoded;

         const customerAccount = await this.accountService.findById(user.id);
         if (!customerAccount) { throw new UnauthorizedException('Invalid account.'); }

         const updatedCustomerProfile = await this.customerService.update(customerAccount.profileId, updateCustomerUserDTO);
         return successReturn(res, updatedCustomerProfile, HttpStatus.OK);

      } catch (error) {
         logThrowError(error, CustomerController.name);
      }
   }
}
