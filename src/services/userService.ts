import axios from "axios";
import { IUser } from "./types/user";

export class UserService {
  static async getUnverifiedUsers(search?: string): Promise<IUser[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/unverified-users`,
      {
        params: { search },
      }
    );
    return data;
  }

  static async getVerifiedUsers(search?: string): Promise<IUser[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/verified-users`,
      {
        params: { search },
      }
    );
    return data;
  }

  static async getPendingVerificationUsers(search?: string): Promise<IUser[]> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/pending-verification-users`,
      {
        params: { search },
      }
    );
    return data;
  }

  static async searchAllUsers(search: string): Promise<{
    unverified: IUser[];
    pendingVerification: IUser[];
    verified: IUser[];
  }> {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/search-users`,
      {
        params: { search },
      }
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
