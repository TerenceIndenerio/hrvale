import axios, { AxiosResponse } from 'axios';
import { GlobalConstants } from '@/config/constants';

const baseURL = GlobalConstants.HOST_URL;

const api = axios.create({
  baseURL,
});

interface ApiResponse {
  data: any; 
}
/** will move to different file later */
export const generateToken = async (): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/token', {
      clientId: GlobalConstants.CLIENT_ID,
      clientSecret: GlobalConstants.CLIENT_SECRET,
      userId: GlobalConstants.USER_ID
    });
    return response;
  } catch (error) {
    throw error;
  }
};