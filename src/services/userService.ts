import axios from "axios";
import { IUser } from "./types/user";

export class UserService {
  static async getUnverifiedUsers(): Promise<IUser[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/unverified-users`
    );
    return data;
  }

  static async getVerifiedUsers(): Promise<IUser[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/verified-users`
    );
    return data;
  }

  static async getPendingVerificationUsers(): Promise<IUser[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/pending-verification-users`
    );
    return data;
  }

  static async approveUser(userId: string) {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/approve/${userId}`
    );
    return data;
  }

  static async rejectUser(userId: string) {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/reject/${userId}`
    );
    return data;
  }

  static async getUserById(userId: string): Promise<IUser> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/user-details/${userId}`
    );
    return data;
  }
}
