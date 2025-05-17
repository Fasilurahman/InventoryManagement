import mongoose, { Schema, Document, Types } from 'mongoose';

// infrastructure/database/models/CustomerModel.ts
export interface CustomerDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  }
  
  const CustomerSchema = new Schema<CustomerDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
  });

export const CustomerModel = mongoose.model<CustomerDocument>('Customer', CustomerSchema);
