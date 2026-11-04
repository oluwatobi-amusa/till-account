import { LoginFormData } from '@/app/(auth)/login/types';
import axios from '@/app/utils/axios';
import { API_AUTH_URL } from '@/config';

export const loginUser = async (data: LoginFormData) => {
  const response = await axios(API_AUTH_URL).post(`/login`, data);
  return response;
};
