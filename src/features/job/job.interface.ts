import { JobStatus, WorkPlace } from '@prisma/client';

export interface IJob {
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  location: string;
  workplace: WorkPlace;
  status: JobStatus;
  salaryMin: number;
  salaryMax: number;
  applicationDeadline: Date;
  jobRoleId: number;
}
