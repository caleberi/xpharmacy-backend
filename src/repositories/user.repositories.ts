import { User, UserDocument } from './../schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { ModelRepository } from 'src/interfaces/repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends ModelRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
}
