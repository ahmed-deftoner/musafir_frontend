// import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { BaseUser } from '@/interfaces/signup';
import api from '../pages/api';
import apiEndpoints from '../config/apiEndpoints';
import { SignupUser } from '@/interfaces/signup';

const useSignUpHook = () => {
  // const [user, setUser] = useRecoilState(currentUser);
  const { SIGNUP, LOGOUT, VERIFY_EMAIL } = apiEndpoints;
  const router = useRouter();

  const register = async (user: BaseUser): Promise<unknown> => {
    const data = await api.post(`${SIGNUP}`, user);
    console.log(data);

    // if (Object.keys(data).length > 0) {
    //   setUser(data);
    // }
    return data;
  };

  const verifyEmail = async (password: string, verificationId: string): Promise<any> => {
    const data = await api.post(`${VERIFY_EMAIL}`, {password, verificationId});
    if(data){
      return data;
    } else{
      console.log("error verifying the email")
    }
  }

  // const verifyUser = async (): Promise<unknown> => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   const data = await api.post(`${TOKEN_VERIFY}`, { token: accessToken }, {});
  //   if (Object.keys(data).length > 0) {
  //     setUser(data);
  //   }
  //   return data;
  // };

  const logout = async () => {
    await api.get(LOGOUT);
    localStorage.clear();
    router.replace('/');
  };

  return {
    // user,
    logout,
    register,
    verifyEmail,
  };
};

export default useSignUpHook;
