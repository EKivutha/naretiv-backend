/* Loading the .env file into the process.env object. */
require('dotenv').config()
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';
import { Message } from '../entity/message';
import { Order } from '../entity/order';
import { Payment } from '../entity/payments';
import { Product } from '../entity/product';
import { Rider } from '../entity/rider';
import { Shipment } from '../entity/shipment';
import { User } from '../entity/user';
import { CreateAdminUser1547919837483 } from '../migration/createAdminUser';

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
  logging: false,
  entities: [User, Product, Message, Order, Payment, Shipment, Rider],
  migrations: [CreateAdminUser1547919837483],
  subscribers: ['src/subscribers/**/*{.ts,.js}'],
});

