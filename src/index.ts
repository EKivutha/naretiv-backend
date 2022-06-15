require('dotenv').config()
import express, { NextFunction } from "express";
import { graphqlHTTP } from "express-graphql";
import helmet from 'helmet';
import * as bodyParser from "body-parser";
import morgan from 'morgan';
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import redisClient from "./utils/connectRedis";
import validateEnv from "./utils/validateEnv";
import cors from 'cors';
import config from "config";
import authRouter from './routes/auth';
import userRouter from './routes/user';
import AppError from "./utils/appError";
import cookieParser from 'cookie-parser';

AppDataSource.initialize()
    .then(async () => {
        validateEnv();
        // create express app
        const app = express()
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

        // start express server
        app.listen(3001)

        // insert new users for test
        // await AppDataSource.manager.save(
        //     AppDataSource.manager.create(User, {
        //         name: "Timber",
        //         email: "Saw",
        //         age: 27,
        //         password: '1234'
        //     })
        // )

        // await AppDataSource.manager.save(
        //     AppDataSource.manager.create(User, {
        //         name: "Phantom",
        //         email: "Assassin",
        //         age: 24,
        //         password: '1234'
        //     })
        // )

        console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

    }).catch(error => console.log(error))


