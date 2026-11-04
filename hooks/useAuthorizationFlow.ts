import { useState, Dispatch, SetStateAction, useCallback } from 'react';

type UseAuthorizationFlowResult = {
  isOtpPageVisible: boolean;
  isAuthorized: boolean;
  startAuthorization: () => void;
  confirmAuthorization: () => void;
  setIsAuthorized: Dispatch<SetStateAction<boolean>>;
};

export const useAuthorizationFlow = (): UseAuthorizationFlowResult => {
  const [isOtpPageVisible, setIsOtpPageVisible] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const startAuthorization = useCallback(() => {
    setIsOtpPageVisible(true);
  }, [setIsOtpPageVisible]);

  const confirmAuthorization = useCallback(() => {
    // Perform the authorization logic (e.g., API call) and update the state
    // Once authorized, hide the OTP page and continue with the action
    setIsOtpPageVisible(false);
    setIsAuthorized(true);
  }, [setIsOtpPageVisible, setIsAuthorized]);

  return {
    isOtpPageVisible,
    isAuthorized,
    startAuthorization,
    confirmAuthorization,
    setIsAuthorized
  };
};
