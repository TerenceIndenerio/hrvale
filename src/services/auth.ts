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
      const baseUrl = localStorage.getItem("baseUrl") || "";
      // The baseUrl from localStorage might contain extra path segments like /web/index.php
      // that cause a 404. We will construct a clean URL.
      const url = new URL(baseUrl);
      const correctedBaseUrl = `${url.protocol}//${url.host}`;

      const response: AxiosResponse<BiometricLoginResponse> = await axios.post(`${correctedBaseUrl}/auth/biometric-login/`, {
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
