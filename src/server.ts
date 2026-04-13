import express, { Application, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
// import {appRoutes} from './globals/routes/appRoutes';
import { CustomError, NotFountException } from './globals/cores/error.cores';
import HTTP_STATUS from './globals/constants/http.constant';
import cors from 'cors';
import asyncWrapper from './globals/cores/asyncWrapper.core';
import { razorpayController } from './features/payment/razorpay.controller';
import Routes from './globals/routes/appRoutes';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { initSocket } from './socketManager';
import path from 'path';
import { cronHandler } from './globals/cron-jobs/index.cron';

class Server {
    private app: Application;
    private httpServer: http.Server;
    private io: SocketIOServer;

    constructor() {
        this.app = express();

        const allowedOrigins =
            process.env.NODE_ENV === 'development'
                ? ['http://localhost:3000', 'https://conchate-moistly-lucy.ngrok-free.dev']
                : ['https://jobportal.tirthrojara.in'];

        this.app.use(
            cors({
                // origin: ['http://localhost:3000', 'https://conchate-moistly-lucy.ngrok-free.dev'],
                // origin: ['https://jobportal.tirthrojara.in'],
                origin: allowedOrigins,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                credentials: true // Important for cookies/sessions
            })
        );

        this.httpServer = http.createServer(this.app);

        // this.io = new SocketIOServer(this.httpServer, {
        //     cors: {
        //         origin: ['http://localhost:5173', 'https://conchate-moistly-lucy.ngrok-free.dev'], // allow both frontend origins
        //         methods: ['GET', 'POST', 'PUT', 'DELETE'],
        //         credentials: true
        //     }
        // });

        this.io = initSocket(this.httpServer);
    }

    public start(): void {
        this.setUpMiddleware();
        this.setUpRoutes();
        this.setUpSocket();
        this.setUpGlobalError();
        this.listenServer();
        this.cronjobs();
    }

    private setUpMiddleware(): void {
        // this.app.use(
        //     cors({
        //         // origin: 'http://localhost:5173', // frontend origin
        //         // origin: 'https://conchate-moistly-lucy.ngrok-free.dev', // ngrok
        //         origin: ['http://localhost:5173', 'https://conchate-moistly-lucy.ngrok-free.dev'], // allow both frontend origins
        //         methods: ['GET', 'POST', 'PUT', 'DELETE'],
        //         credentials: true
        //     })
        // );

        Routes.razorpayWebhookRoute(this.app);

        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

        this.app.use(express.json()); // req.body  // postman input

        //rate limiter
        const limiter = rateLimit({
            windowMs: 1 * 60 * 1000, // 15 minutes
            limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
            standardHeaders: 'draft-8',
            legacyHeaders: false,
            ipv6Subnet: 56,
            message: 'Too many requests, please try again after 15 min'
        });
        this.app.use(limiter);

        this.app.use(cookieParser());

        // this.app.use(SubscriptionMiddleware)
    }

    private setUpRoutes(): void {
        Routes.appRoutes(this.app);
    }

    private setUpGlobalError(): void {
        this.app.all('*', (req, res, next) => {
            // res.status(404).json({
            //   message: `The URL ${req.originalUrl} not found with method ${req.method}`
            // });
            next(new NotFountException(`The URL ${req.originalUrl} not found with method ${req.method}`));
        });

        //next(new BadRequestException('asdfdsdfsdf))

        //Global Error => error, req, res, next
        this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
            console.log('check error: ', error);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }

            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                messaage: 'Something went wrong'
            });
        });
    }

    private setUpSocket() {
        this.io.on('connection', (socket) => {
            console.log('New client connected, socket id:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected, socket id:', socket.id);
            });
        });
    }

    private cronjobs() {
        cronHandler();
    }

    // private listenServer() {
    //     // const port = process.env.PORT || 3030;
    //     const port = process.env.PORT || 3000;
    //     this.app.listen(port, () => {
    //         console.log(`Server is running on port ${port}`);
    //     });
    // }
    private listenServer() {
        // const port = process.env.PORT || 3030;
        const port = process.env.PORT || 5000;
        this.httpServer.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default Server;
