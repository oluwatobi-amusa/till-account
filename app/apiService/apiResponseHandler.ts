import { toast } from 'sonner';

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    message?: string;
  };
  errors?: {
    [key: string]: string[];
  };
}

export interface ApiErrorResponse {
  response?: {
    data?: ApiResponse;
  };
  message?: string;
}

export const HandleApiSuccess = (data?: ApiResponse, customMessage?: string) => {
  const message = data?.message || data?.data?.message || customMessage;

  toast.success('Successful!', {
    style: { color: 'black', backgroundColor: 'white' },
    description: message,
    closeButton: true,
    richColors: true
  });
};

export const HandleApiError = (error: Error | ApiErrorResponse | undefined, retry?: () => void) => {
  const apiError = error as ApiErrorResponse;

  const errorMessage =
    apiError?.response?.data?.message ||
    apiError?.message ||
    (error as any)?.message ||
    'An error occurred, please try again.';

  toast.error('Uh oh! Something went wrong.', {
    style: { color: 'white', backgroundColor: 'red', accentColor: 'white' },
    description: errorMessage,
    action: retry
      ? {
          label: 'Retry',
          onClick: retry
        }
      : undefined,
    closeButton: true,
    richColors: true
  });
};
