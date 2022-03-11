import { Injectable } from '@nestjs/common';
import {
  AnyObject,
  Callback,
  CallbackWithoutResult,
  Document,
  FilterQuery,
  HydratedDocument,
  Model,
  NativeError,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

@Injectable()
export abstract class ModelRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: AnyObject): Promise<T> {
    return await this.model.create(data);
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: any,
    options?: QueryOptions,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Promise<HydratedDocument<T, {}, {}>> {
    return await this.model.findOne(filter, projection, options);
  }

  async findById(
    id: any,
    projection?: any,
    options?: QueryOptions,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Promise<T | null> {
    return await this.findOne(
      { _id: id },
      { __id: 0, __v: 0, ...projection },
      options,
    );
  }

  async deleteById(
    id?: any,
    options?: QueryOptions,
    callback?: (
      err: NativeError,
      // eslint-disable-next-line @typescript-eslint/ban-types
      doc: HydratedDocument<T, {}, {}>,
      res: any,
    ) => void,
  ) {
    return await this.model.findByIdAndDelete(id, options, callback);
  }

  async deleteOne(
    filter?: FilterQuery<T>,
    options?: QueryOptions,
    callback?: (
      err: NativeError,
      // eslint-disable-next-line @typescript-eslint/ban-types
      doc: HydratedDocument<T, {}, {}>,
      res: any,
    ) => void,
  ) {
    return await this.model.findOneAndDelete(filter, options, callback);
  }

  async deleteMany(
    filter?: FilterQuery<T>,
    options?: QueryOptions,
    callback?: CallbackWithoutResult,
  ) {
    return await this.model.deleteMany(filter, options, callback);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async findMany(callback?: Callback<HydratedDocument<T, {}, {}>[]>) {
    return await this.model.find(callback);
  }

  async updateById(
    id?: any,
    update?: UpdateQuery<T>,
    options?: QueryOptions,
    callback?: (
      err: NativeError,
      // eslint-disable-next-line @typescript-eslint/ban-types
      doc: HydratedDocument<T, {}, {}>,
      res: any,
    ) => any,
  ): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, update, options, callback);
  }
}
