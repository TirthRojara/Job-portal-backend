import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../cores/error.cores";
import jwt from "jsonwebtoken";

export async function verifyUser(req: Request, res: Response, next: NextFunction) {

    // 1) Get token from cookie
    if (!req.cookies?.accessToken) {
        // throw new BadRequestException('Please login again')  // this error can be use with asyncwrapper
        next(new BadRequestException('Please login again'))
    }
    const token = req.cookies.accessToken

    // 2) Verify token
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET! ) as UserPayLoad;
    const  { name, email, role, id} = decoded

    // 3) assign verify token from step 2, assign to req.currentUser
    req.currentUser = { name, email, role, id }

    next()
    } catch (error: any) {
        // throw new BadRequestException('Please login again')
        next(new BadRequestException('Please login again'))
    }
}
