import express, { Application, NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import appRoutes from './globals/routes/appRoutes';
import { CustomError, NotFountException } from './globals/cores/error.cores';
import HTTP_STATUS from './globals/constants/http.constant';

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
    this.app.use(express.json()); // req.body  // postman input
    this.app.use(cookieParser())
  }

  private setUpRoutes(): void {
    appRoutes(this.app);
  }

  private setUpGlobalError(): void {
    this.app.all('*', (req, res, next) => {
      // res.status(404).json({
      //   message: `The URL ${req.originalUrl} not found with method ${req.method}`
      // });
      next(new NotFountException(`The URL ${req.originalUrl} not found with method ${req.method}`))
    });

    //next(new BadRequestException('asdfdsdfsdf))

    //Global Error => error, req, res, next
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      console.log('check error: ', error)
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        messaage: 'Something went wrong'
      })
    });
  }

  private listenServer() {
    const port = process.env.PORT || 3030;
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default Server;
