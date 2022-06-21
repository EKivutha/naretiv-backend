import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
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
    entities: [User],
    migrations: [CreateAdminUser1547919837483],
    subscribers: ['src/subscribers/**/*{.ts,.js}']
})