import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { createExpense, updateExpense } from '../services/api';
import toast from 'react-hot-toast';

const categories = ['Food', 'Transport', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment', 'Other'];

const ExpenseForm = () => {
  const { addExpense, updateExpense: updateExpenseContext } = useExpenses();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingExpense) {
        const updatedExpense = await updateExpense(editingExpense._id, formData);
        updateExpenseContext(updatedExpense);
        setEditingExpense(null);
      } else {
        const newExpense = await createExpense(formData);
        addExpense(newExpense);
      }
      
      setFormData({ description: '', amount: '', category: 'Food' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category
    });
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    setFormData({ description: '', amount: '', category: 'Food' });
  };

  // Expose handleEdit function to be used by ExpenseList
  React.useImperativeHandle(window.expenseFormRef, () => ({
    handleEdit
  }));

  // Store ref globally for ExpenseList to access
  React.useEffect(() => {
    window.expenseFormRef = { current: { handleEdit } };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Plus className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          {editingExpense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter expense description"
            required
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'Saving...' : editingExpense ? 'Update' : 'Add Expense'}</span>
          </button>
          
          {editingExpense && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;