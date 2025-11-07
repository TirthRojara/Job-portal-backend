import prisma from '~/prisma';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { BadRequestException, NotFountException } from '~/globals/cores/error.cores';
import { generateToken } from '~/globals/helpers/jwt.helper';
import { RecruiterPackageStatus, User } from '@prisma/client';

class AuthService {
  public async signUp(requestBody: any) {
    const { email, name, password, role } = requestBody;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role ? role : 'CANDIDATE'
      }
    });

    if ( role === 'RECRUITER' ) {
      await prisma.recruiterPackage.create({
        data: {
          status: RecruiterPackageStatus.ACTIVE,
          userId: user.id,
          packageId: 4 // free package
        }
      })
    }

    //create JWT
    const accessToken = generateToken(user);

    return accessToken;
  }

  public async signIn(requestBody: any) {
    const { email, password } = requestBody;

    // 1) Make sure email exist
    const userByEmail = await this.findUserByEmail(email);

    if (!userByEmail) throw new NotFountException(`The email ${email} does not exist`);

    // 2) Make sure match password
    const isMatchPassword = await bcrypt.compare(password, userByEmail.password);
    if (!isMatchPassword) throw new BadRequestException('Invalid credentials');

    // 3) Generate token
    const accessToken = generateToken(userByEmail);
    return accessToken;
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: { email }
    });
  }
}

export const authService: AuthService = new AuthService();
