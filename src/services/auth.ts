import axios, { AxiosResponse } from "axios";

const baseURL = localStorage.getItem("baseUrl") || "";
const api = axios.create({
  baseURL,
});

interface BiometricLoginResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const authService = {
  async biometricLogin(employeeName: string): Promise<BiometricLoginResponse> {
    try {
      const response: AxiosResponse<BiometricLoginResponse> = await api.post("auth/biometric-login/", {
        employeeName,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw error;
    }
  },
};

export default authService;
