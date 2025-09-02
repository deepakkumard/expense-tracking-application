import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchExpenses, fetchExpenseSummary } from '../services/api';
import toast from 'react-hot-toast';

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  summary: { total: 0, byCategory: {} },
  loading: false,
  error: null,
  filter: 'All'
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(exp =>
          exp._id === action.payload._id ? action.payload : exp
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload)
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const loadExpenses = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const expenses = await fetchExpenses();
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to load expenses');
    }
  };

  const loadSummary = async () => {
    try {
      const summary = await fetchExpenseSummary();
      dispatch({ type: 'SET_SUMMARY', payload: summary });
    } catch (error) {
      console.error('Failed to load summary:', error);
    }
  };

  const addExpense = (expense) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    loadSummary();
    toast.success('Expense added successfully!');
  };

  const updateExpense = (expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
    loadSummary();
    toast.success('Expense updated successfully!');
  };

  const deleteExpense = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
    loadSummary();
    toast.success('Expense deleted successfully!');
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  useEffect(() => {
    loadExpenses();
    loadSummary();
  }, []);

  const value = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    setFilter,
    loadExpenses,
    loadSummary
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within ExpenseProvider');
  }
  return context;
};