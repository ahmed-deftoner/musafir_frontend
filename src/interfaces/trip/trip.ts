import { IFlagship } from "@/services/types/flagship";

export interface IRegistration {
  _id: string;
  flagship: IFlagship | string;
  user: IUser | string;
  payment?: IPayment | string;
  status: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  id: string;
}

export interface IUser {
  _id: string;
  fullName: string;
  profileImg: string;
  email: string;
  phone: string;
  referralID: string;
  gender: string;
  cnic: string;
  dateOfBirth: string;
  university: string;
  socialLink: string;
  city: string;
  roles: string[];
  emailVerified: boolean;
  verification: IVerification;
  createdAt: string;
  updatedAt: string;
}

export interface IVerification {
  status: string;
  RequestCall: boolean;
  videoLink?: string;
  referralIDs?: string[];
}

export interface IPayment {
  _id: string;
  user: string;
  amount: number;
  bankName: string;
  status: string;
  paymentType: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
