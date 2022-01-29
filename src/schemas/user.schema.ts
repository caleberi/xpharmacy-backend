import { UserRole } from './../constants/roles.constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import validator from 'validator';
import { messages } from 'src/utils/messages.util';

export type UserDocument = User & Document;

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
})
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({
    type: String,
    enum: [
      UserRole.ADMIN,
      UserRole.DEVELOPER,
      UserRole.SALE_REP,
      UserRole.MANAGER,
    ],
    default: UserRole.SALE_REP,
  })
  role: UserRole;
  @Prop({
    required: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: messages.INVALID_EMAIL,
    },
  })
  email: string;
  @Prop({
    validate: {
      validator: (value: string) => validator.isMobilePhone(value),
      message: messages.INVALID_PHONE_NUMBER,
    },
  })
  phone: string;
  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserHookMiddleware = () => {
  const schema = UserSchema;
  schema.pre('save', function (next) {
    console.log('Hello from pre save');
    next();
  });
  return schema;
};
