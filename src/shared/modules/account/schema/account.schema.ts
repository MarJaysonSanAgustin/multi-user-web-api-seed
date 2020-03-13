import * as mongoose from 'mongoose';
import * as passportLocalMongoose from 'passport-local-mongoose';

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

export const AccountSchema = new Schema({
   email:
   {
      type: String,
      lowercase: true,
      trim: true,
   },
   password:
   {
      type: String,
      minlength: 8,
   },
   role:
   {
      type: String,
      enum: ['admin', 'customer'],
      lowercase: true,
      required: true,
   },
   profileId: {
      type: ObjectId,
      required: true,
   },
   isVerified:
   {
      type: Boolean,
      default: false,
   },
}, { versionKey: false });

const options = {
   limitAttempts: true,
   maxAttempts: 10,
};

AccountSchema.plugin(passportLocalMongoose, options);
