interface UserPayLoad {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Package {
  id: number;
  planId: string;
  label: string;
  price: number;
  jobPostLimit: number;
  isActive: boolean;
}

interface RecruiterPackagePayload {
  id: number;
  startDate: Date;
  endDate: Date | null;
  razorpaySubscriptionId: string | null;
  status: RecruiterPackageStatus;
  billingCycleCount: number | null;    
  userId: number;
  packageId: number;
  package: Package;
}

declare namespace Express {
  export interface Request {
    currentUser: UserPayLoad;
    recruiterPackage?: RecruiterPackagePayload;
  }
  export interface Response {
    currentUser: UserPayLoad;
  }
}
