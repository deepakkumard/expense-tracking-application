import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

const COLORS = {
  Food: '#10B981',
  Transport: '#3B82F6', 
  Shopping: '#8B5CF6',
  Utilities: '#F59E0B',
  Healthcare: '#EF4444',
  Entertainment: '#EC4899',
  Other: '#6B7280'
};

const ExpenseChart = () => {
  const { summary } = useExpenses();

  const chartData = Object.entries(summary.byCategory || {}).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: COLORS[category] || COLORS.Other
  }));

  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Expense Chart</h2>
        </div>
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Chart will appear when you add expenses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Expense Chart</h2>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatAmount(value)} />
            <Legend 
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;