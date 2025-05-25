import api from '../pages/api';
import apiEndpoints from '../config/apiEndpoints';

const useUserHandler = () => {
  const { USER } = apiEndpoints;

  const getMe = async (): Promise<any> => {  
    const res = await api.get(USER.GET_ME);
    if (res.statusCode === 200) {
      return res.data;
    } else {
      return [];
    }
  };

  return {
    getMe,
  };
};

export default useUserHandler;