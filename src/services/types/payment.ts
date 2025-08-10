import { IRegistration } from "@/interfaces/trip/trip";
import { IFlagship } from "./flagship";
import { IUser } from "./user";

export interface ICreatePayment {
  bankAccount: string;
  paymentType: string;
  registration: string;
  amount: number;
  discount?: number;
  screenshot: File;
}

export interface IBankAccount {
  _id: string;
  bankName: string;
  accountNumber: string;
  IBAN: string;
  __v: number;
}

export interface IPayment {
  _id: string;
  registration: IRegistration | string;
  bankAccount: IBankAccount | string;
  paymentType: string;
  amount: number;
  discount?: number;
  screenshot: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRequestRefund {
  registration: string;
  bankDetails: string;
  reason: string;
  feedback: string;
  rating: number;
}

export interface IRefund {
  _id: string;
  registration: IRegistration | string;
  bankDetails: string;
  reason: string;
  feedback: string;
  rating: number;
  status: "pending" | "cleared" | "rejected";
  createdAt: string;
  updatedAt: string;
}
