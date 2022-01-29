import { CONFIG_OPTIONS } from './../constants/modules.constants';
import { Inject, Injectable } from '@nestjs/common';
import { camelCase } from 'lodash';
import * as dotenv from 'dotenv';
import * as path from 'path';

export type EnvironmentVariableType = number | string | object;

const CONFIG_MSG: (key: string) => string = (key: string) =>
  `Variable with name : ${key} is not present as an enviromental variable`;

interface EnvironmentVariables {
  [key: string]: EnvironmentVariableType;
}

function parseValue(value: number | string): number | string | object | never {
  if (typeof value == 'number') return value;
  try {
    // if it is a typescript object
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

@Injectable()
export class ConfigService {
  /**
   * @description Stores the enviromental variable in a self contained
   * Environmental object
   */
  private environmentalVariable: EnvironmentVariables = {};
  constructor(
    @Inject(CONFIG_OPTIONS)
    private options: {
      file: string;
      keys: string[];
    },
  ) {
    dotenv.config({ path: path.join(__dirname, '../../', options.file) });
    options.keys.forEach((key) => {
      this.setEnvironmentalVariable(key);
    });
  }

  private parseKeyToCamelCase(key: string): string {
    return camelCase(key);
  }
  private setEnvironmentalVariable(key: string): void {
    this.environmentalVariable[this.parseKeyToCamelCase(key)] =
      this.getEnvironmentVariable(key);
  }
  private getEnvironmentVariable(
    key: string,
  ): number | object | string | never {
    const parsedKey: string = key.toUpperCase();
    if (!(parsedKey in process.env)) {
      throw new ConfigurationError(CONFIG_MSG(key));
    }
    return parseValue(process.env[parsedKey]);
  }

  public get(key: string) {
    return this.environmentalVariable[key];
  }
}
