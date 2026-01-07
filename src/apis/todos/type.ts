export interface CreditCalculateResponse {
  monthlyInstallmentAmount: number
  totalPaybackAmount: number
  commissionRate: number
  monthlyInterestRate: number
  yearlyInterestRate: number
  accrualDate: string
  commissionAmount: number
  encryptedLoanInfo: string
  maturityDate?: string
}

export interface CreditCalculateRequest {
  creditAmount: number
  creditMaturity?: number
  creditDate?: string
  encryptedLoanInfo: string
  encryptedLimitInfo?: string
}
