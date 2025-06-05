export interface ApiResponse<T = any> {
  responseSuccessful: boolean;
  responseMessage: string;
  responseBody?: T;
}

// User types
export interface User {
  id: number;
  username: string | null;
  email: string;
  phone: string;
  password: string;
  status: string;
  pin: string | null;
  isVerified: boolean;
  source: string;
  fmcToken: string | null;
  refereshToken: string | null;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  fullname: string;
  gender: string;
  country: string;
  currency: string;
  profile_picture: string;
  createdAt: string;
  updatedAt: string;
}

// Specific response types
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
}

export interface ProfileResponse {
  user: User;
  userProfile: UserProfile;
}
export  interface ModalProps {
  open: boolean;
  onClose: () => void;
}