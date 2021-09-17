import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const requiredEnvs = [
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'JWT_SECRET',
  'PORT',
  'MODE',
] as const;

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  getValue(key: typeof requiredEnvs[number]): string {
    const value = this.env[key];

    if (!value) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  ensureValues(keys: typeof requiredEnvs) {
    keys.forEach((k) => this.getValue(k));

    return this;
  }

  getPort() {
    return this.getValue('PORT');
  }

  isProduction() {
    const mode = this.getValue('MODE');

    return mode != 'DEV';
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      cli: {
        migrationsDir: 'src/migration',
      },
      ssl: this.isProduction(),
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues(requiredEnvs);

export { configService };
