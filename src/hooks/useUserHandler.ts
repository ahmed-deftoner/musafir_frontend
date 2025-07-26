import api from "../pages/api";
import apiEndpoints from "../config/apiEndpoints";
import { User } from "../interfaces/login";

interface ResetPasswordData {
  email: string;
  previousPassword: string;
  password: string;
  confirmPassword: string;
}

const useUserHandler = () => {
  const { USER } = apiEndpoints;

  const getMe = async (): Promise<User> => {
    const res = await api.get(USER.GET_ME);
    if (res.statusCode === 200) {
      return res.data;
    } else {
      throw new Error("Failed to fetch user data");
    }
  };

  const resetPassword = async (
    data: ResetPasswordData
  ): Promise<{ message: string }> => {
    try {
      const res = await api.post(USER.RESET_PASSWORD, data);
      return res.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  return {
    getMe,
    resetPassword,
  };
};

export default useUserHandler;
