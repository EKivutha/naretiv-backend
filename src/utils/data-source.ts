/* Loading the .env file into the process.env object. */
require('dotenv').config()
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';
import { User } from '../entity/user';
import { Message } from '../entity/message';

// import { CreateAdminUser1547919837483 } from '../migration/createAdminUser';

const postgresConfig = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>('postgresConfig');

export const AppDataSource = new DataSource({
  ...postgresConfig,
  type: 'postgres',
  synchronize: true, //allow message and auto order updates through api subscriptions.
  // logging:true,
  // logging: "all",
  entities: [User, Message],
  // migrations: [CreateAdminUser1547919837483],
  // subscribers: ['src/subscribers/**/*{.ts,.js}'],
});

