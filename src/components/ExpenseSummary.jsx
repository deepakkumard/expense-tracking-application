import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const ExpenseSummary = () => {
  const { summary } = useExpenses();

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const categoryEntries = Object.entries(summary.byCategory || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Expense Summary</h2>
      </div>
      
      {/* Total Amount */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatAmount(summary.total)}</p>
          </div>
        </div>
      </div>
      
      {/* Category Breakdown */}
      {categoryEntries.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">By Category</h3>
          <div className="space-y-2">
            {categoryEntries.map(([category, amount]) => {
              const percentage = summary.total > 0 ? (amount / summary.total * 100).toFixed(1) : 0;
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-700">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatAmount(amount)}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {categoryEntries.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No expenses yet. Start tracking to see your summary!
        </p>
      )}
    </div>
  );
};

export default ExpenseSummary;