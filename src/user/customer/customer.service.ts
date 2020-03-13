import { Injectable, Inject, UnprocessableEntityException, NotFoundException } from '@nestjs/common';

import { Model } from 'mongoose';
import { ObjectId } from 'bson';

import { IUserCustomer, IUserCustomerPaged } from 'src/shared/interfaces/user-customer.interface';
import { CreateUserProfileDTO } from 'src/shared/dtos/create-user-profile.dto';
import { logThrowError } from 'src/shared/functions/log-throw-error';

@Injectable()
export class CustomerService {

   constructor(
      @Inject('USER_CUSTOMER_MODEL') private readonly customerModel: Model<IUserCustomer>
   ) { }

   async create(createCustomerUserDTO: CreateUserProfileDTO): Promise<IUserCustomer> {
      try {
         const newCustomer = new this.customerModel(createCustomerUserDTO);
         return await newCustomer.save();
      } catch (error) {
         logThrowError(error, CustomerService.name);
      }
   }

   async find(query: any): Promise<IUserCustomer> {
      try {
         return await this.customerModel.findOne(query);
      } catch (error) {
         logThrowError(error, CustomerService.name);
      }
   }

   async findById(customerId: string): Promise<IUserCustomer> {
      try {

         if (!ObjectId.isValid(customerId)) { throw new UnprocessableEntityException(`${customerId} is not a valid customer id.`); }

         return await this.customerModel.findById(customerId).exec();

      } catch (error) {
         logThrowError(error, CustomerService.name);
      }
   }

   async get(page: string | number, rows: string | number): Promise<IUserCustomerPaged> {
      try {

         page = parseInt(page as string, 10);
         rows = parseInt(rows as string, 10);

         const customers = await this.customerModel.find({})
            .sort({ createdAt: -1 })
            .skip((rows * page) - rows)
            .limit(rows)
            .exec();

         const customersTotal = await this.customerModel.countDocuments();

         return { total: customersTotal, page, rows, customersTotal: customers.length || 0, customers };

      } catch (error) {
         logThrowError(error, CustomerService.name);
      }
   }

   async update(customerId: string, updateObj: object): Promise<IUserCustomer> {
      try {

         if (!ObjectId.isValid(customerId)) { throw new UnprocessableEntityException(`${customerId} is not a valid customer id.`); }

         const updatedCustomer = await this.customerModel
            .findByIdAndUpdate(customerId, { $set: { ...updateObj } }, { new: true, runValidators: true })
            .exec();

         if (!updatedCustomer) { throw new NotFoundException(`Customer not found.`); }

         return updatedCustomer;

      } catch (error) {
         logThrowError(error, CustomerService.name);
      }
   }
}
