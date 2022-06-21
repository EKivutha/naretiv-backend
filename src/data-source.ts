import "reflect-metadata"
import { DataSource } from "typeorm"
import { Message } from "./entity/message"
import { Order } from "./entity/order"
import { Payment } from "./entity/payments"
import { Product } from "./entity/product"
import { Rider } from "./entity/rider"
import { Shipment } from "./entity/shipment"
import { User } from "./entity/user"
import { CreateAdminUser1547919837483 } from "./migration/createAdminUser"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User, Product, Message, Order, Payment, Shipment, Rider],
    migrations: [CreateAdminUser1547919837483],
    subscribers: ['src/subscribers/**/*{.ts,.js}']
})