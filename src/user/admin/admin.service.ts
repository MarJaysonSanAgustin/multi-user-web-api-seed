import { Injectable, Inject, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { IUserAdmin, IUserAdminPaged } from 'src/shared/interfaces/user-admin.interface';
import { CreateUserProfileDTO } from 'src/shared/dtos/create-user-profile.dto';
import { logThrowError } from 'src/shared/functions/log-throw-error';
import { UpdateUserProfileDTO } from 'src/shared/dtos/update-user-profile.dto';
import { ObjectId } from 'bson';

@Injectable()
export class AdminService {

   constructor(
      @Inject('USER_ADMIN_MODEL') private readonly adminModel: Model<IUserAdmin>,
   ) { }

   async create(createAdminUserDTO: CreateUserProfileDTO): Promise<IUserAdmin> {
      try {

         const newAdmin = new this.adminModel(createAdminUserDTO);
         await newAdmin.save({ validateBeforeSave: true });
         return newAdmin;

      } catch (error) {
         logThrowError(error, AdminService.name);
      }
   }

   async get(page: string | number, rows: string | number, query?: any): Promise<IUserAdminPaged> {
      try {

         page = parseInt(page as string, 10);
         rows = parseInt(rows as string, 10);

         const admins = await this.adminModel.find({ ...query })
            .sort({ createdAt: -1 })
            .skip((rows * page) - rows)
            .limit(rows)
            .exec();

         const adminsTotal = await this.adminModel.find({ ...query }).countDocuments();

         return { total: adminsTotal, page, rows, adminsTotal: admins.length || 0, admins };

      } catch (error) {
         logThrowError(error, AdminService.name);
      }
   }

   async findById(adminId: string): Promise<IUserAdmin> {
      try {

         if (!(ObjectId.isValid(adminId))) { throw new UnprocessableEntityException(`${adminId} is not a valid admin id.`); }

         const admin = await this.adminModel.findById(adminId).exec();
         if (!admin) { throw new NotFoundException(`Admin not found.`); }

         return admin;

      } catch (error) {
         logThrowError(error, AdminService.name);
      }
   }

   async find(query: any): Promise<IUserAdmin> {
      try {
         return await this.adminModel.findOne(query).exec();
      } catch (error) {
         logThrowError(error, AdminService.name);
      }
   }

   async update(adminId: string, updateAdminUserDTO: UpdateUserProfileDTO): Promise<IUserAdmin> {
      try {

         if (!(ObjectId.isValid(adminId))) { throw new UnprocessableEntityException(`${adminId} is not a valid admin id.`); }

         const updatedAdmin = await this.adminModel
            .findByIdAndUpdate(adminId, { $set: { ...updateAdminUserDTO } }, { new: true, runValidators: true })
            .exec();

         if (!updatedAdmin) { throw new NotFoundException(`Admin not found.`); }

         return updatedAdmin;

      } catch (error) {
         logThrowError(error, AdminService.name);
      }
   }
}
