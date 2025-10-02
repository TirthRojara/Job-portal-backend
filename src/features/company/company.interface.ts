export interface ICompanyCreateUpdate {
  name: string;
  description: string;
  location: string;
  address?: string;
  mapLink?: string;
  websiteUrl?: string;
  totalEmployees: number;
  establishedDate: Date;
}

