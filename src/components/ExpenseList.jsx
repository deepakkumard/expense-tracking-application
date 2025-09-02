import React, { useState } from 'react';
import { Trash2, Edit, Filter, DollarSign } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { deleteExpense as deleteExpenseAPI } from '../services/api';
import { exportExpenses, importExpenses } from "../services/api";
import toast from 'react-hot-toast';

const categories = ['All', 'Food', 'Transport', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment', 'Other'];

const categoryColors = {
  Food: 'bg-green-100 text-green-800',
  Transport: 'bg-blue-100 text-blue-800',
  Shopping: 'bg-purple-100 text-purple-800',
  Utilities: 'bg-yellow-100 text-yellow-800',
  Healthcare: 'bg-red-100 text-red-800',
  Entertainment: 'bg-pink-100 text-pink-800',
  Other: 'bg-gray-100 text-gray-800'
};

const ExpenseList = () => {
  const { expenses, loading, filter, setFilter, deleteExpense } = useExpenses();
  const [deletingId, setDeletingId] = useState(null);

  const filteredExpenses = filter === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === filter);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteExpenseAPI(id);
      deleteExpense(id);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (expense) => {
    if (window.expenseFormRef?.current?.handleEdit) {
      window.expenseFormRef.current.handleEdit(expense);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleExport = async (format) => {
    try {
      await exportExpenses(format);
      toast.success(`Expenses exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await importExpenses(file);
      toast.success(`Imported ${res.count} expenses`);
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header with Filter, Export and Import */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => handleExport("csv")}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport("xlsx")}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
            >
              Export Excel
            </button>
            <label className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 cursor-pointer">
              Import File
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="p-6">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <DollarSign className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">
              {filter === 'All' ? 'No expenses yet. Add your first expense!' : `No expenses in ${filter} category.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExpenses.map((expense) => (
              <div
                key={expense._id || expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {expense.description}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[expense.category]}`}>
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatAmount(expense.amount)}
                  </span>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit expense"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(expense._id)}
                      disabled={deletingId === expense._id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete expense"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;