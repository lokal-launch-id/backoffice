import { apiClient, API_ENDPOINTS } from '@/lib/api'
import {
  LoginFormData,
  SignUpFormData,
  ForgotPasswordFormData,
  OtpFormData,
  LoginResponse,
  AuthUser,
} from '../data/schema'

export interface SignUpResponse {
  message: string
  user: AuthUser
}

export interface ForgotPasswordResponse {
  message: string
}

export interface OtpResponse {
  message: string
  token?: string
}

export class AuthApi {
  // Login user
  static async login(credentials: LoginFormData): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, credentials)
  }

  // Sign up user
  static async signUp(userData: SignUpFormData): Promise<SignUpResponse> {
    return apiClient.post<SignUpResponse>('/signup', userData)
  }

  // Logout user
  static async logout(): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.auth.logout)
  }

  // Forgot password
  static async forgotPassword(
    email: ForgotPasswordFormData
  ): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/forgot-password', email)
  }

  // Verify OTP
  static async verifyOtp(otpData: OtpFormData): Promise<OtpResponse> {
    return apiClient.post<OtpResponse>('/verify-otp', otpData)
  }

  // Refresh token
  static async refreshToken(): Promise<{ token: string }> {
    return apiClient.post<{ token: string }>(API_ENDPOINTS.auth.refresh)
  }

  // Get current user profile
  static async getCurrentUser(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/profile')
  }

  // Update user profile
  static async updateProfile(userData: Partial<AuthUser>): Promise<AuthUser> {
    return apiClient.put<AuthUser>('/profile', userData)
  }
}

// Export individual functions for convenience
export const {
  login,
  signUp,
  logout,
  forgotPassword,
  verifyOtp,
  refreshToken,
  getCurrentUser,
  updateProfile,
} = AuthApi
