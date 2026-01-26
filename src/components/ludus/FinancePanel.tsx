/**
 * FinancePanel Component
 * 
 * Displays ludus finances including gold, revenue, expenses, and financial health
 */

import React from 'react';
import { formatGold, formatNumber } from '@utils/helpers';

interface FinancePanelProps {
  gold: number;
  dailyRevenue: number;
  dailyExpenses: number;
  totalIncome: number;
  totalSpent: number;
  showDetailed?: boolean;
}

export const FinancePanel: React.FC<FinancePanelProps> = ({
  gold,
  dailyRevenue,
  dailyExpenses,
  totalIncome,
  totalSpent,
  showDetailed = true,
}) => {
  const netDaily = dailyRevenue - dailyExpenses;
  const isProfit = netDaily >= 0;
  const profitMargin = dailyRevenue > 0 ? (netDaily / dailyRevenue) * 100 : 0;
  const daysUntilBankrupt = gold > 0 && netDaily < 0 ? Math.floor(gold / Math.abs(netDaily)) : Infinity;

  return (
    <div className="rounded-lg border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-lg">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b-2 border-yellow-300 pb-3">
        <h2 className="text-2xl font-bold text-yellow-900">💰 Finance Overview</h2>
        <div className="text-right">
          <p className="text-xs text-yellow-700">Current Balance</p>
          <p className="text-3xl font-bold text-yellow-900">{formatGold(gold)}</p>
        </div>
      </div>

      {/* Daily Finances */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        {/* Daily Revenue */}
        <div className="rounded-lg bg-green-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Daily Revenue</p>
              <p className="mt-1 text-2xl font-bold text-green-900">
                +{formatGold(dailyRevenue)}
              </p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        {/* Daily Expenses */}
        <div className="rounded-lg bg-red-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Daily Expenses</p>
              <p className="mt-1 text-2xl font-bold text-red-900">
                -{formatGold(dailyExpenses)}
              </p>
            </div>
            <div className="text-4xl">📉</div>
          </div>
        </div>
      </div>

      {/* Net Daily Income */}
      <div
        className={`mb-4 rounded-lg p-4 ${
          isProfit
            ? 'bg-gradient-to-r from-green-200 to-green-300'
            : 'bg-gradient-to-r from-red-200 to-red-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Net Daily Income</p>
            <p className={`mt-1 text-3xl font-bold ${isProfit ? 'text-green-900' : 'text-red-900'}`}>
              {isProfit ? '+' : ''}{formatGold(netDaily)}
            </p>
            {!isProfit && daysUntilBankrupt < Infinity && (
              <p className="mt-1 text-xs font-semibold text-red-800">
                ⚠️ Bankrupt in {daysUntilBankrupt} days!
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-700">Profit Margin</p>
            <p className={`text-xl font-bold ${isProfit ? 'text-green-900' : 'text-red-900'}`}>
              {profitMargin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      {showDetailed && (
        <div className="grid grid-cols-2 gap-3 border-t-2 border-yellow-300 pt-4">
          <div className="rounded bg-white p-3">
            <p className="text-xs font-medium text-gray-600">Total Income</p>
            <p className="mt-1 text-lg font-bold text-green-700">
              {formatGold(totalIncome)}
            </p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="text-xs font-medium text-gray-600">Total Spent</p>
            <p className="mt-1 text-lg font-bold text-red-700">
              {formatGold(totalSpent)}
            </p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="text-xs font-medium text-gray-600">Net Lifetime</p>
            <p className={`mt-1 text-lg font-bold ${totalIncome - totalSpent >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatGold(totalIncome - totalSpent)}
            </p>
          </div>
          <div className="rounded bg-white p-3">
            <p className="text-xs font-medium text-gray-600">Days of Reserve</p>
            <p className="mt-1 text-lg font-bold text-blue-700">
              {dailyExpenses > 0 ? Math.floor(gold / dailyExpenses) : '∞'}
            </p>
          </div>
        </div>
      )}

      {/* Financial Health Indicator */}
      <div className="mt-4 rounded-lg bg-white p-3">
        <p className="mb-2 text-sm font-medium text-gray-700">Financial Health</p>
        <div className="relative h-4 overflow-hidden rounded-full bg-gray-300">
          <div
            className={`h-full transition-all duration-500 ${
              profitMargin > 20
                ? 'bg-green-500'
                : profitMargin > 0
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.max(0, Math.min(100, 50 + profitMargin))}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-600">
          <span>🔴 Losing Money</span>
          <span>🟡 Breaking Even</span>
          <span>🟢 Profitable</span>
        </div>
      </div>
    </div>
  );
};
