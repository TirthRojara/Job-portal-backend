import express, { Application, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
// import {appRoutes} from './globals/routes/appRoutes';
import { CustomError, NotFountException } from './globals/cores/error.cores';
import HTTP_STATUS from './globals/constants/http.constant';
import cors from 'cors';
import asyncWrapper from './globals/cores/asyncWrapper.core';
import { razorpayController } from './features/payment/razorpay.controller';
import Routes from './globals/routes/appRoutes';
// import bodyParser from 'body-parser';

class Server {
  private app: Application;

  constructor() {
    this.app = express();
  }

  public start(): void {
    this.setUpMiddleware();
    this.setUpRoutes();
    this.setUpGlobalError();
    this.listenServer();
  }


  private setUpMiddleware(): void {
    this.app.use(
      cors({
        // origin: 'http://localhost:5173', // frontend origin
        // origin: 'https://conchate-moistly-lucy.ngrok-free.dev', // ngrok
        origin: ['http://localhost:5173', 'https://conchate-moistly-lucy.ngrok-free.dev'], // allow both frontend origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
      })
    );

    Routes.razorpayWebhookRoute(this.app);

    this.app.use(express.json()); // req.body  // postman input
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

  private listenServer() {
    // const port = process.env.PORT || 3030;
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default Server;
