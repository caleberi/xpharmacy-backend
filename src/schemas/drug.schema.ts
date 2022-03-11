import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DrugType } from 'src/constants/drugs.constants';

export type DrugDocument = Drug & Document;

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
export class Drug {
  @Prop({ min: 0 })
  amountPerPack?: number;
  @Prop({ minlength: 3 })
  genericName?: string;
  @Prop({ required: true })
  manufactureDate: Date;
  @Prop({
    type: String,
    enum: DrugType,
    default: DrugType.UNKNOWN,
  })
  drugType: DrugType;
  @Prop({ minlength: 3 })
  brandName?: string;
  @Prop({ required: true })
  expiryDate: Date;
  @Prop({ min: 0 })
  quantitySold: number;
  @Prop()
  entryDate: string;
  @Prop()
  lastModifiedAt: Date;
}
