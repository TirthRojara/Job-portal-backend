import { Gender } from "@prisma/client";

export interface ICandidateProfile {
  fullName: string;
  summary: string;
  gender: Gender;
  phone: string;
  // cv: string | undefined;
  birthDate: string;
  address: string;
  openToWork?: boolean;
}
