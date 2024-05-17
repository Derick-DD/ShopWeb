// Nest dependencies
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Other dependencies
import * as env from 'dotenv';

env.config();

export class ConfigService {
  public getEnv(key: string): any {
    return process.env[key];
  }

  public isProduction(): boolean {
    return this.getEnv('MODE') === 'PROD';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getEnv('DB_HOST'),
      database: this.getEnv('DB_NAME'),
      port: this.getEnv('DB_PORT'),
      username: this.getEnv('DB_USERNAME'),
      password: this.getEnv('DB_PASSWORD'),
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}

export const configService = new ConfigService();
