import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { GlobalConstants } from '@/config/constants';

const baseURL = GlobalConstants.HOST_URL;

const api = axios.create({
  baseURL,
});

interface ApiResponse {
  data: any; 
}
/** will move to different file later */
export const generateToken = async (payload:any): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/token', {
      clientId: payload.username,
      clientSecret: payload.password,
      userId: GlobalConstants.USER_ID
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/** will move to different file later */
export const leaveRequestAPi = async (): Promise<any> => {
  let action = 'api/v2/leave/leave-requests';
  const config: AxiosRequestConfig = {
    url: `${GlobalConstants.HOST_URL}${action}`,
    method: 'GET',
    data: {},
    headers: {
      Authorization: `Bearer ${localStorage.getItem('_token')}`
    }
  };
  return await axios(config);
};