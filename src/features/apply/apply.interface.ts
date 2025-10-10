import { ApplyStatus } from '@prisma/client';

export interface IApplyStatus {
  candidateProfileId: number;
  status: ApplyStatus;
}
