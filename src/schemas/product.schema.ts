import { User } from 'src/schemas/user.schema';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductType } from 'src/constants/products.constants';
import * as mongoose from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'recently_updated_at',
  },
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  versionKey: false,
})
export class Product {
  @Prop({
    required: true,
    minlength: 3,
  })
  name: string;
  @Prop({ min: 0 })
  quantity: number;
  @Prop({
    min: 0.0,
    required: true,
  })
  costPrice: number;
  @Prop({
    min: 0.0,
    required: true,
  })
  sellingPrice: number;
  @Prop({
    minlength: 50,
    maxlength: 1000,
  })
  description?: string;
  @Prop({
    type: String,
    enum: ProductType,
    default: ProductType.UNCLASSIFIED,
    required: true,
  })
  productType: ProductType;
  @Prop({})
  brandName?: string;
  @Prop({ required: true })
  expiryDate: Date;
  @Prop({})
  quantitySold: number;
  @Prop({ required: true })
  entryDate: string;
  @Prop({})
  lastModifiedAt: Date;
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  author: User[];
}
