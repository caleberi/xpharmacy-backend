import { CONFIG_OPTIONS } from '../constants/modules.constants';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Module({})
export class ConfigModule {
  public static register(options?: {
    file: string;
    keys: string[];
  },global?:boolean): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
      global: global?true:false,
    };
  }
}
