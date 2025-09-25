interface UserPayLoad {
  id: number;
  name: string;
  email: string;
  role: string;
}

declare namespace Express {
  export interface Request {
    currentUser: UserPayLoad;
  }
  export interface Response {
    currentUser: UserPayLoad;
  }
}
