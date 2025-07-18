export interface ApiResponse<T = any> {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: T
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface User {
  id: number
  username: string | null
  email: string
  phone: string
  password: string
  status: string
  pin: string | null
  isVerified: boolean
  source: string
  fmcToken: string | null
  refereshToken: string | null
  lastLogin: string
  createdAt: string
  updatedAt: string
  isProfileComplete: boolean
  isAgent: boolean
  isStateCordinator: boolean
}

export interface AllUsersResponse {
  users: User[]
  pagination: Pagination
}

export interface UserDetail {
  id: number
  status: string
  firstName: string
  lastName: string
  email: string
  password?: string
  createdAt: string
  updatedAt: string
  isVerified: boolean
}

export interface UserProfile {
  id: number
  status: string
  user_id: number
  fullname: string
  gender: string
  country: string
  currency: string
  profile_picture: string
  createdAt: string
  updatedAt: string
  
}

export interface UserDetailsResponseBody {
  totalTransactions: number
  totalPendingTransactions: number
  totalInvestment: number
  user: UserDetail
  userProfile: UserProfile
}

export interface Transaction {
  id: number
  wallet_id: number
  transaction_type: string
  amount: string
  transaction_reference: string
  status: "success" | "failed" | "pending"
  description: string
  metadata: string // JSON string
  recipientId: number | null
  processed_at: string // Date string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface UserTransactionsResponseBody {
  transactions: Transaction[]
  pagination: Pagination
}

export interface PasswordChangeResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody: User
}

export interface CoordinatorRegistrationRequest {
  fullname: string
  email: string
  phone: string
  gender: string
  dob: string
  country: string
  state: string
  lga: string
  address: string
  idCard: string
  reason: string
}

export interface CoordinatorRegistrationResponse {
  responseSuccessful: boolean
  responseMessage: string
}

export interface PasswordChangeRequest {
  old_password: string
  new_password: string
  confirm_new_password: string
}

export interface ModalProps {
  open: boolean
  onClose: () => void
}

export interface TopUpRequest {
  amount: number
  email?: string
  callback_url?: string
}

export interface TopUpResponse {
  authorization_url: string
  access_code: string
  reference: string
}

export interface DashboardResponse {
  balance: string
  transactions: Array<{
    date: string
    type: string
    description: string
    amount: string
    status: "Completed" | "Pending" | "Failed"
  }>
}

export interface PaymentRequest {
  amount: number
}

export interface DataRequest {
  serviceID: string
  billersCode: string
  variation_code: string
  amount: number
  phone: string
  pin: number
}

export interface CableBillRequest {
  amount: string
  phone: string
  pin: number
  serviceID?: string
  billersCode: string
  variation_code: string
}

export interface ElectricBillRequest {
  amount: string
  phone: string
  pin: number
  serviceID?: string
  billersCode: string
  variation_code: string
}

export interface AirtimeRequest {
  amount: number
  phone: string
  pin: number
  network?: string
}

export interface Network {
  id: string
  name: string
  note: string
  image: string
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
export interface AllUsersResponse {
  users: User[]
  pagination: Pagination
}
interface DataPlan {
  variation_code: string
  name: string
  variation_amount: string
  fixedPrice: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface VerifyOtpResponse {
  accessToken: string
}

export interface ProfileResponse {
  user: User
  userProfile: UserProfile
}
