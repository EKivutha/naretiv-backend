require('dotenv').config()
import express, { NextFunction } from "express";
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
import messageRouter from './routes/message';
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
                // origin: config.get<string>('origin'),
                credentials: true,
            })
        );

        app.use('/api/auth', authRouter);
        app.use('/api/users', userRouter);
        app.use('/api/messages', messageRouter);
        
        
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
        const port = config.get<number>('port');
        app.listen(port, '0.0.0.0')


        console.log(`Express server has started on http://44.202.32.175:${port}/ to see results`)

    }).catch((error: any) => console.log(error))


