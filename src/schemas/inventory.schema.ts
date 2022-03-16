import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from './product.schema';

export type InventoryDocument = Inventory & Document;

@Schema()
export class Inventory {
  @Prop()
  location: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  })
  products: Product[];

  @Prop()
  breed: string;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
