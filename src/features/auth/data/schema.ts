import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signUpSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
    firstName: z.string().min(1, { message: 'First name is required.' }),
    lastName: z.string().min(1, { message: 'Last name is required.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SignUpFormData = z.infer<typeof signUpSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const otpSchema = z.object({
  otp: z.string().min(6, { message: 'OTP must be 6 characters.' }).max(6),
})

export type OtpFormData = z.infer<typeof otpSchema>

export interface AuthUser {
  id: string
  email: string
  username: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  is_indonesian_maker: boolean
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  message: string
  token: string
  user: AuthUser
}

export interface AuthError {
  message: string
  errors?: Record<string, string[]>
}
