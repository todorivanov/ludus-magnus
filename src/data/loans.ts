/**
 * Loan System Data
 * Defines loan types, terms, and calculations
 */

export type LoanTerm = 'short' | 'medium' | 'long';

export interface LoanType {
  id: LoanTerm;
  name: string;
  description: string;
  icon: string;
  minAmount: number;
  maxAmount: number;
  durationMonths: number;
  interestRate: number; // Total interest as percentage (e.g., 15 = 15%)
  missedPaymentPenalty: {
    factionFavorLoss: number;
    description: string;
  };
}

export const LOAN_TYPES: Record<LoanTerm, LoanType> = {
  short: {
    id: 'short',
    name: 'Short-Term Loan',
    description: 'Quick cash for immediate needs. Higher monthly payments but less total interest.',
    icon: '💰',
    minAmount: 100,
    maxAmount: 500,
    durationMonths: 6,
    interestRate: 15, // 15% total interest
    missedPaymentPenalty: {
      factionFavorLoss: 10,
      description: 'Miss 1 payment: -10 Senate favor. Miss 2: Risk of sabotage.'
    }
  },
  
  medium: {
    id: 'medium',
    name: 'Medium-Term Loan',
    description: 'Balanced option for expansion or recovery. Moderate payments over a year.',
    icon: '🏛️',
    minAmount: 500,
    maxAmount: 2000,
    durationMonths: 12,
    interestRate: 25, // 25% total interest
    missedPaymentPenalty: {
      factionFavorLoss: 15,
      description: 'Miss payment: -15 Senate favor. Risk of building seizure.'
    }
  },
  
  long: {
    id: 'long',
    name: 'Long-Term Loan',
    description: 'Large capital for major investments. Small monthly payments but high total interest.',
    icon: '🏦',
    minAmount: 2000,
    maxAmount: 5000,
    durationMonths: 24,
    interestRate: 40, // 40% total interest
    missedPaymentPenalty: {
      factionFavorLoss: 25,
      description: 'Severe consequences. Defaulting may result in game over.'
    }
  }
};

/**
 * Calculate monthly payment for a loan
 */
export function calculateMonthlyPayment(
  principal: number,
  interestRate: number,
  durationMonths: number
): number {
  const totalInterest = principal * (interestRate / 100);
  const totalAmount = principal + totalInterest;
  return Math.round(totalAmount / durationMonths);
}

/**
 * Calculate total amount to be repaid
 */
export function calculateTotalRepayment(
  principal: number,
  interestRate: number
): number {
  const totalInterest = principal * (interestRate / 100);
  return principal + totalInterest;
}

/**
 * Calculate remaining balance on a loan
 */
export function calculateRemainingBalance(
  principal: number,
  interestRate: number,
  monthsPaid: number,
  durationMonths: number
): number {
  const totalRepayment = calculateTotalRepayment(principal, interestRate);
  const monthlyPayment = Math.round(totalRepayment / durationMonths);
  const totalPaid = monthlyPayment * monthsPaid;
  return Math.max(0, totalRepayment - totalPaid);
}
