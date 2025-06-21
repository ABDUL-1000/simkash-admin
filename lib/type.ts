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
export interface TopUpRequest {
  amount: number;
  email?: string;
  callback_url?: string;
}

export interface TopUpResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}
export interface DashboardResponse {
  balance: string;
  transactions: Array<{
    date: string;
    type: string;
    description: string;
    amount: string;
    status: "Completed" | "Pending" | "Failed";
  }>;
  // Add any other fields your dashboard API returns
}
export interface PaymentRequest {
  amount: number;
  // Add any other fields your payment API requires
}
export interface DataRequest {
   serviceID: string;
  billersCode: string;
  variation_code: string;
  amount: number;
  phone: string;
  pin: number;
}
export interface AirtimeRequest {
  amount: number;
  phone: string;
  pin: number;
  network?: string; 
}
export interface Network {
  id: string
  name: string
  note: string
  image: string
}
export interface ApiResponse<T> {
  status: boolean
  message: string
  data: T | null
}

export interface User {

  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
  }
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: string
  status: string
  reference: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export interface Setting {
  id: string
  name: string
  value: string
  createdAt: Date
  updatedAt: Date
}

export interface DataPlansResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody: {
    ServiceName: string
    serviceID: string
    convinience_fee: string
    variations: DataPlan[]
  }
}

  
 interface DataPlan {
  variation_code: string
  name: string
  variation_amount: string
  fixedPrice: string
}


export interface UserDetails {
  id: number;
  username: string | null;
  email: string;
  phone: string;
  password: string;
}

export interface UserProfile {
  id: number;
  fullname: string;
  gender: string;
  country: string;
  currency: string;
  profile_picture: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}



export interface DashboardData {
  transaction: Transaction[];
  userDetails: UserDetails;
  userProfile: UserProfile;
  wallet: Wallet;
}