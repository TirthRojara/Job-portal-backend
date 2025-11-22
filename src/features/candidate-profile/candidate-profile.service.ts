import { CandidateProfile } from '@prisma/client';
import { NotFountException } from '~/globals/cores/error.cores';
import prisma from '~/prisma';
import { ICandidateProfile } from './candidate-profile.interface';
import { deleteCV } from '~/globals/helpers/upload.helper';

class CandidateProfileService {
    public async create(
        requestBody: ICandidateProfile,
        currentUser: UserPayLoad,
        file: Express.Multer.File[]
    ): Promise<CandidateProfile> {
        // const { fullName, gender, phone, cv, birthDate, address } = requestBody;
        const { birthDate, openToWork, ...rest } = requestBody;

        const cvURL = file[0].filename;

        const candidateProfile = await prisma.candidateProfile.create({
            data: {
                ...rest,
                cv: cvURL,
                birthDate: new Date(birthDate),
                userId: currentUser.id,
                openToWork: Boolean(openToWork)
            }
        });

        return candidateProfile;
    }

    public async readAll(): Promise<CandidateProfile[]> {
        const candidates: CandidateProfile[] = await prisma.candidateProfile.findMany();

        return candidates;
    }

    public async readOne(id: number): Promise<CandidateProfile> {
        const candidate: CandidateProfile | null = await prisma.candidateProfile.findUnique({
            where: { userId: id }
        });

        if (!candidate) throw new NotFountException(`Candidate profile with User ID: ${id} not found`);

        return candidate;
    }

    public async readById(id: number): Promise<CandidateProfile> {
        const candidate: CandidateProfile | null = await prisma.candidateProfile.findUnique({
            where: { id }
        });

        if (!candidate) throw new NotFountException(`Candidate profile with User ID: ${id} not found`);

        return candidate;
    }

    public async update(
        id: number,
        requestBody: ICandidateProfile,
        file: Express.Multer.File[]
    ): Promise<CandidateProfile> {
        // const { fullName, gender, phone, cv, birthDate, address, openToWork } = requestBody;
        const { birthDate, ...rest } = requestBody;

        // const cvURL = file[0].filename;
        const cvURL = file && file.length > 0 ? file[0].filename : undefined;

        await this.readOne(id);

        if (cvURL) {
            const oldCV = await prisma.candidateProfile.findUnique({
                where: { userId: id },
                select: { cv: true }
            });

            const profileUpdate = await prisma.candidateProfile.update({
                where: { userId: id },
                data: {
                    ...rest,
                    birthDate: birthDate ? new Date(birthDate) : undefined,
                    cv: cvURL
                }
            });

            if (oldCV) {
                deleteCV(oldCV.cv);
            }

            return profileUpdate;
        } else {
            const profileUpdate = await prisma.candidateProfile.update({
                where: { userId: id },
                data: {
                    ...rest,
                    birthDate: birthDate ? new Date(birthDate) : undefined
                }
            });

            return profileUpdate;
        }
    }

    public async remove(id: number): Promise<void> {
        await this.readOne(id);
        await prisma.candidateProfile.delete({
            where: { userId: id }
        });
    }
}

export const candidateProfileService: CandidateProfileService = new CandidateProfileService();
