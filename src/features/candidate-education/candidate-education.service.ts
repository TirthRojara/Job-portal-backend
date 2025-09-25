import prisma from '~/prisma';
import { candidateProfileService } from '../candidate-profile/candidate-profile.service';
import { CandidateEducation, Education } from '@prisma/client';
import { NotFountException } from '~/globals/cores/error.cores';
import { ICandidateEducationCreate, ICandidateEducationUpdate } from './candidate-education.interface';


class CandidateEducationService {
  private async findEducation(educationId: number): Promise<Education> {
    const education = await prisma.education.findUnique({
      where: { id: educationId }
    });

    if (!education) throw new NotFountException(`Education with ID ${educationId} not found`);

    return education;
  }

  public async create(requestBody: ICandidateEducationCreate, currentUser: UserPayLoad) {
    const { ...rest } = requestBody;

    await this.findEducation(requestBody.educationId);

    const candidateProfile = await candidateProfileService.readOne(currentUser.id);

    const candidateEducation = await prisma.candidateEducation.create({
      data: {
        ...rest,
        candidateProfileId: candidateProfile.id
      }
    });

    return candidateEducation;
  }

  public async readAll(): Promise<CandidateEducation[]> {
    const candidateEducation = await prisma.candidateEducation.findMany();
    return candidateEducation;
  }

  // public async readMyEducation(currentUser: UserPayLoad): Promise<CandidateEducation[]> {
  //   const candidateProfile = await candidateProfileService.readOne(currentUser.id);

  //   const candidateEducation = await prisma.candidateEducation.findMany({
  //     where: {
  //       candidateProfileId: candidateProfile.id
  //     }
  //   });

  //   if (candidateEducation.length === 0) {
  //     // Option 1: Throw error
  //     throw new NotFountException(`No education records found for candidate with User ID: ${currentUser.id}`);

  //     // Option 2: Return null or custom object instead of empty array
  //     // return null;
  //   }

  //   return candidateEducation;
  // }

  public async readMyEducation(currentUser: UserPayLoad): Promise<CandidateEducation[]> {
    const candidateProfileWithEducation = await prisma.candidateProfile.findUnique({
      where: { userId: currentUser.id },
      include: {
        CandidateEducation: true // Include related education records
      }
    });

    if (!candidateProfileWithEducation) {
      throw new NotFountException(`Candidate profile with User ID: ${currentUser.id} not found`);
    }

    if (candidateProfileWithEducation.CandidateEducation.length === 0) {
      // Option 1: Throw error
      throw new NotFountException(`No education records found for candidate with User ID: ${currentUser.id}`);

      // Option 2: Return null or custom object instead of empty array
      // return null;
    }

    return candidateProfileWithEducation.CandidateEducation;
  }

  public async update(
    educationId: number,
    requestBody: ICandidateEducationUpdate,
    currentUser: UserPayLoad
  ): Promise<CandidateEducation> {
    const { ...rest } = requestBody;

    await this.findEducation(educationId);
    const candidateProfile = await candidateProfileService.readOne(currentUser.id);

    const candidateEducation = await prisma.candidateEducation.update({
      where: {
        candidateProfileId_educationId: {
          candidateProfileId: candidateProfile.id,
          educationId: educationId
        }
      },
      data: {
        ...rest
      }
    });

    return candidateEducation;
  }

  public async remove(educationId: number, currentUser: UserPayLoad): Promise<void> {
    const candidateProfile = await candidateProfileService.readOne(currentUser.id);
    await this.findEducation(educationId);
    await prisma.candidateEducation.delete({
      where: {
        candidateProfileId_educationId: {
          candidateProfileId: candidateProfile.id,
          educationId
        }
      }
    });
  }
}

export const candidateEducationService: CandidateEducationService = new CandidateEducationService();
