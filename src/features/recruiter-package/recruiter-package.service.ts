import prisma from '~/prisma';
import { BadRequestException, NotFountException } from '~/globals/cores/error.cores';
import { packageService } from '../package/package.service';

class RecruiterPackageService {
  
}

export const recruiterPackageService: RecruiterPackageService = new RecruiterPackageService();
