import { loginUser } from '@/app/apiService/authService';
import { useHandledMutation } from '@/hooks/useHandledMutation';

export const useLoginMutation = () => {
  return useHandledMutation(loginUser, 'You have successfully logged in!');
};
