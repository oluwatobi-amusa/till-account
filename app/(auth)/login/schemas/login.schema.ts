import * as z from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .trim()
    .min(1, { message: 'Email address is required' }),
  password: z.string().trim().min(1, { message: 'Password is required' })
});
