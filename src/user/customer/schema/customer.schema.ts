import { Schema } from 'mongoose';

/**
 * You can add fields
 * specifically for customer profile.
 */
export const CustomerSchema = new Schema({
   firstName: {
      type: String,
      required: true,
   },
   lastName: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'email is required.'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      unique: true,
   },
   gender: {
      type: String,
      enum: ['M', 'F', 'U'],
      required: false,
   },
   birthDate: Date,
   contactNumber: String,

}, { versionKey: false, timestamps: true });
