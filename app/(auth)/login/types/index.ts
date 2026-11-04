import * as z from 'zod';
import { loginFormSchema } from '../schemas/login.schema';

export type LoginFormData = z.infer<typeof loginFormSchema>;
