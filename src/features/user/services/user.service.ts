import { User } from "@prisma/client"
import {  BadRequestException } from "~/globals/cores/error.cores";
import prisma from "~/prisma"
import { userCreateSchema } from "../schemas/user.schema";
import HTTP_STATUS from "~/globals/constants/http.constant";

class UserService {
    public async createUser(requestBody: any): Promise<User>{
        const { name, email, password, role } = requestBody 

        // const isEmailExist = true;
        // if (isEmailExist) {
        //     throw new BadRequestException('Email already exist')
        // }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                status: true,
                role: 'CANDIDATE'
            }
        })
        return user
    }

    public async getAll(): Promise<User[]> {
        const users = await prisma.user.findMany()
        return users;
    }
}

export const userService: UserService = new UserService()






