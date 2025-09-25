
export enum Degree {
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  PHD = 'PHD'
}

export interface ICandidateEducationUpdate {
  major: string;
  degree: Degree;
  yearStart: number;
  yearEnd: number;
}

export interface ICandidateEducationCreate extends ICandidateEducationUpdate {
    educationId: number;
}