import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { GlobalConstants } from "@/config/constants";

// Get baseURL from localStorage or set a default value
const baseURL = localStorage.getItem("baseUrl") || "";
const api = axios.create({
  baseURL,
});

interface ApiResponse {
  data: any;
}

export const generateToken = async (payload: any): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post("auth/token/", {
      clientId: payload.username,
      clientSecret: payload.password,
      userId: GlobalConstants.USER_ID,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const leaveRequestAPi = async (): Promise<any> => {
  let action = "api/v2/leave/leave-requests";
  const config: AxiosRequestConfig = {
    url: `${baseURL}${action}`, // Use the global baseURL
    method: "GET",
    data: {},
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return await axios(config);
};
