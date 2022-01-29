import { User, UserHookMiddleware, UserSchema } from './../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './../repositories/user.repositories';
import { UserService } from './../services/user.service';
import { Module } from '@nestjs/common';
import { UserController } from 'src/controllers/user.controller';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: UserHookMiddleware,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [],
})
export class UserModule {}
