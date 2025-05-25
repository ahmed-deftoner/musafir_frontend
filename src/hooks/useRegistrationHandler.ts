import api from '../pages/api';
import apiEndpoints from '../config/apiEndpoints';
import { BaseRegistration } from '@/interfaces/registration';
import { showAlert } from '@/pages/alert';

const useRegistrationHook = () => {
  const { REGISTRATION } = apiEndpoints;

  const create = async (data: BaseRegistration): Promise<unknown> => {
    const res = await api.post(`${REGISTRATION.CREATE}`, data);
    if (res.statusCode === 201) {
        return res.data;
    }
    return false;
  };

  const getPastPassport = async (): Promise<any> => {
    const res = await api.get(`${REGISTRATION.GET_PAST_PASSPORT}`);
    if (res.statusCode === 200) {
      return res.data;
    }
    return false;
  };

  const getUpcomingPassport = async (): Promise<any> => {
    const res = await api.get(`${REGISTRATION.GET_UPCOMING_PASSPORT}`);
    if (res.statusCode === 200) {
      return res.data;
    }
    return false;
  };

  const sendReEvaluateRequestToJury = async (registrationId: string): Promise<unknown> => {
    const res = await api.post(`${REGISTRATION.SEND_RE_EVALUATE_REQUEST_TO_JURY}`, { registrationId });
    if (res.statusCode === 200) {
      showAlert(res.message, 'success');
      return true;
    }
    showAlert(res.message, 'error');
    return false;
  };

  return {
    create,
    getPastPassport,
    getUpcomingPassport,
    sendReEvaluateRequestToJury,
  };
};

export default useRegistrationHook;
