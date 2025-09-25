import { WorkPlace } from "@prisma/client";

export interface ICandidateExperience {
  companyName: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  position: string;
  description: string;
  currentlyWorking: boolean;
  workPlace: WorkPlace;
  location: string;
}
