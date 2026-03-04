/**
 * Loans Redux Slice
 * Manages active loans, payment history, and debt tracking
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';
import { calculateMonthlyPayment, type LoanTerm } from '@data/loans';

export interface Loan {
  id: string;
  type: LoanTerm;
  principal: number; // Original loan amount
  interestRate: number; // Interest rate as percentage
  durationMonths: number; // Total loan duration
  monthlyPayment: number; // Required monthly payment
  monthsTaken: number; // Month when loan was taken (for tracking)
  yearTaken: number; // Year when loan was taken
  monthsPaid: number; // Number of payments made
  missedPayments: number; // Number of missed payments
  isActive: boolean;
}

export interface LoanHistory {
  loanId: string;
  action: 'taken' | 'paid' | 'missed' | 'completed';
  amount?: number;
  month: number;
  year: number;
  description: string;
}

interface LoansState {
  activeLoans: Loan[];
  loanHistory: LoanHistory[];
  totalDebtOwed: number; // Current total outstanding debt
  nextLoanId: number;
}

const initialState: LoansState = {
  activeLoans: [],
  loanHistory: [],
  totalDebtOwed: 0,
  nextLoanId: 1,
};

const loansSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    // Take a new loan
    takeLoan: (
      state,
      action: PayloadAction<{
        type: LoanTerm;
        amount: number;
        interestRate: number;
        durationMonths: number;
        currentMonth: number;
        currentYear: number;
      }>
    ) => {
      const { type, amount, interestRate, durationMonths, currentMonth, currentYear } = action.payload;
      
      const monthlyPayment = calculateMonthlyPayment(amount, interestRate, durationMonths);
      
      const newLoan: Loan = {
        id: `loan-${state.nextLoanId}`,
        type,
        principal: amount,
        interestRate,
        durationMonths,
        monthlyPayment,
        monthsTaken: currentMonth,
        yearTaken: currentYear,
        monthsPaid: 0,
        missedPayments: 0,
        isActive: true,
      };
      
      state.activeLoans.push(newLoan);
      state.nextLoanId += 1;
      
      // Update total debt
      const totalRepayment = amount * (1 + interestRate / 100);
      state.totalDebtOwed += totalRepayment;
      
      // Record in history
      state.loanHistory.push({
        loanId: newLoan.id,
        action: 'taken',
        amount,
        month: currentMonth,
        year: currentYear,
        description: `Took ${type}-term loan of ${amount} gold`
      });
    },
    
    // Make a payment on a loan
    makePayment: (
      state,
      action: PayloadAction<{
        loanId: string;
        currentMonth: number;
        currentYear: number;
      }>
    ) => {
      const { loanId, currentMonth, currentYear } = action.payload;
      const loan = state.activeLoans.find(l => l.id === loanId);
      
      if (!loan || !loan.isActive) return;
      
      loan.monthsPaid += 1;
      state.totalDebtOwed -= loan.monthlyPayment;
      
      // Record payment
      state.loanHistory.push({
        loanId,
        action: 'paid',
        amount: loan.monthlyPayment,
        month: currentMonth,
        year: currentYear,
        description: `Paid ${loan.monthlyPayment} gold`
      });
      
      // Check if loan is fully paid
      if (loan.monthsPaid >= loan.durationMonths) {
        loan.isActive = false;
        state.loanHistory.push({
          loanId,
          action: 'completed',
          month: currentMonth,
          year: currentYear,
          description: `Loan fully repaid!`
        });
      }
    },
    
    // Pay off a loan early (remaining balance with discount)
    payOffLoan: (
      state,
      action: PayloadAction<{
        loanId: string;
        payoffAmount: number;
        currentMonth: number;
        currentYear: number;
      }>
    ) => {
      const { loanId, payoffAmount, currentMonth, currentYear } = action.payload;
      const loan = state.activeLoans.find(l => l.id === loanId);
      
      if (!loan || !loan.isActive) return;
      
      loan.isActive = false;
      state.totalDebtOwed = Math.max(0, state.totalDebtOwed - (loan.monthlyPayment * (loan.durationMonths - loan.monthsPaid)));
      
      state.loanHistory.push({
        loanId,
        action: 'completed',
        amount: payoffAmount,
        month: currentMonth,
        year: currentYear,
        description: `Loan paid off early for ${payoffAmount} gold (saved ${loan.monthlyPayment * (loan.durationMonths - loan.monthsPaid) - payoffAmount}g in interest)`
      });
    },
    
    // Refinance a loan (replace with new terms)
    refinanceLoan: (
      state,
      action: PayloadAction<{
        loanId: string;
        newType: LoanTerm;
        currentMonth: number;
        currentYear: number;
      }>
    ) => {
      const { loanId, newType, currentMonth, currentYear } = action.payload;
      const loan = state.activeLoans.find(l => l.id === loanId);
      
      if (!loan || !loan.isActive) return;
      
      const remainingPayments = loan.durationMonths - loan.monthsPaid;
      const remainingBalance = loan.monthlyPayment * remainingPayments;
      
      // Refinance: extend the term with the new type's interest rate, on the remaining balance
      const REFINANCE_RATES: Record<LoanTerm, { duration: number; rate: number }> = {
        short: { duration: 6, rate: 12 },
        medium: { duration: 12, rate: 20 },
        long: { duration: 24, rate: 35 },
      };
      const newTerms = REFINANCE_RATES[newType];
      const newMonthlyPayment = calculateMonthlyPayment(remainingBalance, newTerms.rate, newTerms.duration);
      
      loan.isActive = false;
      state.totalDebtOwed -= loan.monthlyPayment * remainingPayments;
      
      state.loanHistory.push({
        loanId: loan.id,
        action: 'completed',
        month: currentMonth,
        year: currentYear,
        description: `Loan refinanced into new ${newType}-term loan`
      });
      
      const refinancedLoan: Loan = {
        id: `loan-${state.nextLoanId}`,
        type: newType,
        principal: remainingBalance,
        interestRate: newTerms.rate,
        durationMonths: newTerms.duration,
        monthlyPayment: newMonthlyPayment,
        monthsTaken: currentMonth,
        yearTaken: currentYear,
        monthsPaid: 0,
        missedPayments: 0,
        isActive: true,
      };
      
      state.activeLoans.push(refinancedLoan);
      state.nextLoanId += 1;
      state.totalDebtOwed += calculateMonthlyPayment(remainingBalance, newTerms.rate, newTerms.duration) * newTerms.duration;
      
      state.loanHistory.push({
        loanId: refinancedLoan.id,
        action: 'taken',
        amount: remainingBalance,
        month: currentMonth,
        year: currentYear,
        description: `Refinanced: ${remainingBalance}g over ${newTerms.duration} months at ${newTerms.rate}%`
      });
    },
    
    // Record a missed payment
    missPayment: (
      state,
      action: PayloadAction<{
        loanId: string;
        currentMonth: number;
        currentYear: number;
      }>
    ) => {
      const { loanId, currentMonth, currentYear } = action.payload;
      const loan = state.activeLoans.find(l => l.id === loanId);
      
      if (!loan || !loan.isActive) return;
      
      loan.missedPayments += 1;
      
      // Record missed payment
      state.loanHistory.push({
        loanId,
        action: 'missed',
        month: currentMonth,
        year: currentYear,
        description: `MISSED PAYMENT! (${loan.missedPayments} total)`
      });
    },
  },
});

export const {
  takeLoan,
  makePayment,
  missPayment,
  payOffLoan,
  refinanceLoan,
} = loansSlice.actions;

// Selectors
export const selectActiveLoans = (state: RootState) => 
  state.loans.activeLoans.filter(loan => loan.isActive);

export const selectTotalDebtOwed = (state: RootState) => 
  state.loans.totalDebtOwed;

export const selectMonthlyPaymentDue = (state: RootState) => 
  state.loans.activeLoans
    .filter(loan => loan.isActive)
    .reduce((total, loan) => total + loan.monthlyPayment, 0);

export const selectLoanHistory = (state: RootState) => 
  state.loans.loanHistory;

export const selectLoanById = (loanId: string) => (state: RootState) =>
  state.loans.activeLoans.find(loan => loan.id === loanId);

export default loansSlice.reducer;
