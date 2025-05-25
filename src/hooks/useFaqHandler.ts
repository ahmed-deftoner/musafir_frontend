import api from '../pages/api';
import apiEndpoints from '../config/apiEndpoints';

const useFaqHook = () => {
  const { FAQ } = apiEndpoints;

  const getFaq = async (flagshipId: string): Promise<any> => {  
    const res = await api.get(FAQ.GET.replace(':flagshipId', flagshipId));
    if (res.statusCode === 200) {
      return res.data;
    } else {
      return [];
    }
  };

  return {
    getFaq,
  };
};

export default useFaqHook;
