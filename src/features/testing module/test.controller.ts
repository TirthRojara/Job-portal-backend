import { NextFunction, Request, Response } from "express";
import HTTP_STATUS from "~/globals/constants/http.constant";
import { testService } from "./test.service";

class TestController {
      public async test(req: Request, res: Response, next: NextFunction) {
     
        const test = await testService.test()

        return res.status(HTTP_STATUS.OK).json({
            message: 'Test successful',
            data: test
        })
    }
}

export const testController: TestController = new TestController();