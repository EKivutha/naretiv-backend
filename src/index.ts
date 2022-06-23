require('dotenv').config()
import express, { NextFunction } from "express";
import { graphqlHTTP } from "express-graphql";
import helmet from 'helmet';
import * as bodyParser from "body-parser";
import morgan from 'morgan';
import { Request, Response } from "express";
import { AppDataSource } from "./utils/data-source";
import { User } from "./entity/user";
import redisClient from "./utils/connectRedis";
import validateEnv from "./utils/validateEnv";
import cors from 'cors';
import config from "config";
import authRouter from './routes/auth';
import userRouter from './routes/user';
import productRouter from './routes/product';
import messageRouter from './routes/message';
import orderRouter from './routes/order';
import AppError from "./utils/appError";
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';

AppDataSource.initialize()
    .then(async () => {
        validateEnv();

        // create express app
        const app = express()

        const credentials = await nodemailer.createTestAccount();
        // console.log(credentials);
        
    

        // TEMPLATE ENGINE
        app.set('view engine', 'pug');
        app.set('views', `${__dirname}/views`);

        app.use(express.json({ limit: '10kb' }));
        if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
        app.use(cookieParser());
        app.use(helmet())
        app.use(
            cors({
                origin: config.get<string>('origin'),
                credentials: true,
            })
        );

        app.use('/api/auth', authRouter);
        app.use('/api/users', userRouter);
        app.use('/api/products', productRouter);
        app.use('/api/messages', messageRouter);
        app.use('/api/orders', orderRouter);
        // app.use(
        //     "/graphql",
        //     graphqlHTTP({
        //       schema,
        //       graphiql: true,
        //     })
        //   );
        // setup express app here
        // ...
        app.get('/api/healthchecker', async (_, res: Response) => {
            const message = await redisClient.get('try');
            res.status(200).json({
                status: 'success',
                message,
            });
        });

        app.all('*', (req: Request, res: Response, next: NextFunction) => {
            next(new AppError(404, `Route ${req.originalUrl} not found`));
        });

        // GLOBAL ERROR HANDLER
        app.use(
            (error: AppError, req: Request, res: Response, next: NextFunction) => {
                error.status = error.status || 'error';
                error.statusCode = error.statusCode || 500;

                res.status(error.statusCode).json({
                    status: error.status,
                    message: error.message,
                });
            }
        );

        // start express server
        app.listen(3001)

        // // insert new users for test
        // await AppDataSource.manager.save(
        //     AppDataSource.manager.create(User, {
        //         name: "Timber",
        //         email: "saw@gmail.com",
        //         age: 27,
        //         password: '12341234'
        //     })
        // )

        // await AppDataSource.manager.save(
        //     AppDataSource.manager.create(User, {
        //         name: "Phantom",
        //         email: "assassin@gmail.com",
        //         age: 24,
        //         password: '12341234'
        //     })
        // )

        console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

    }).catch(error => console.log(error))


