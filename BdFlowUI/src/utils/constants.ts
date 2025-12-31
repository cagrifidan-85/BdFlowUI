export enum CommercialLoanSteps {
  Entry,
  TtkLoansSummary,
  SpotLoanSummary,
  RevolvingLoanSummary,
  Result,
}

export const CREDITUSAGE_TOTAL_STEPS = 3

export const CREDIT_TYPES = {
  TtkLoans: 'TtkLoans',
  SpotLoan: 'SpotLoan',
  RevolvingLoan: 'RevolvingLoan',
} as const

export const SUMMARY_STEPS = {
  TtkLoans: 'TtkLoansSummary',
  SpotLoan: 'SpotLoanSummary',
  RevolvingLoan: 'RevolvingLoanSummary',
} as const

export const DEBOUNCE_TIME = 1000

export const ACCOUNTS = 'ACCOUNTS'

export const DEFAULT_DATE_FORMAT = 'dd.MM.yyyy'

export const CREDIT_KEYS = {
  TtkLoans: 4,
  SpotLoan: 1,
  RevolvingLoan: 2,
} as const
