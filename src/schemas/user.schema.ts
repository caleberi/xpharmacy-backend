import { encrypt } from './../utils/encryptions.util';
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
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.SALE_REP,
  })
  role?: UserRole;
  @Prop({
    type: String,
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
  phone?: string;
  @Prop({ type: String, required: true, select: false })
  password: string;
  @Prop({
    type: String,
    required: true,
    validate: {
      validator: function (val: string) {
        return val === this.password;
      },
      message: messages.INCORRECT_PASSWORD_CONFIRM,
    },
  })
  passwordConfirm: string;
  @Prop({ type: Date })
  lastModifiedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserHookMiddleware = () => {
  const schema = UserSchema;
  schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this['password'] = await encrypt(this['password'] as string);
    this['passwordConfirm'] = undefined;
    next();
  });
  schema.post(/^find/, function (doc, next) {
    next();
  });

  schema.post('save', function (doc, next) {
    console.log('A Document was recently saved .... ');
    console.log(doc);
    // delete the password before sending it out (security)
    doc['password'] = undefined;
    next();
  });

  return schema;
};
