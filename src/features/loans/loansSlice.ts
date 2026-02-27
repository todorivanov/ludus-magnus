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
