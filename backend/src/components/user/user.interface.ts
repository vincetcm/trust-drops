export interface IUser {
  _id: string;
  address: string;
  twitterId: string;
  signature: string;
  approved?: boolean;
}

export interface IUpdateUser {
  approved: boolean;
}
