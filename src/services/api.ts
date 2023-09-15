import axios, { AxiosRequestConfig } from 'axios';
import { GlobalConstants } from '@/config/constants';
import TokenValidationService from './TokenValidationService';

export class ApiService {

  constructor() {
    this.validateToken();
  }

  async getToken(): Promise<void> {
    this.request('auth/token', {
        clientId: GlobalConstants.CLIENT_ID,
        clientSecret: GlobalConstants.CLIENT_SECRET,
        userId: GlobalConstants.USER_ID
      }, 'POST')
      .then((response: any) => {
        if(response.data.token != undefined) {
          localStorage.setItem('_token', response.data.token);
        }
      }).catch(error => {
        console.error(error);
      }
    );
  }

  async validateToken(): Promise<void> {
    /** check the token if expired, if expired it wil just regenerate the token */
    const tokenValidationService = new TokenValidationService();
    const token: string|null = localStorage.getItem("_token");
    const isExpired: boolean = tokenValidationService.isTokenExpired(token);
    if(isExpired && token) {
      this.getToken();
    }
  }

  async request(
    action: string,
    params: any,
    method: string = 'GET'): Promise<void> {
      
    try {
      const config: AxiosRequestConfig = {
        url: `${GlobalConstants.HOST_URL}${action}`,
        method: method,
        data: params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('_token')}`
        }
      };
      return await axios(config);
    } catch (error) {
      console.error(error);
    }
  }
};