import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ExpenseProvider } from './context/ExpenseContext';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseChart from './components/ExpenseChart';

function App() {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Toaster position="top-right" />
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form and Summary */}
            <div className="lg:col-span-1 space-y-6">
              <ExpenseForm />
              <ExpenseSummary />
              <ExpenseChart />
            </div>
            
            {/* Right Column - Expense List */}
            <div className="lg:col-span-2">
              <ExpenseList />
            </div>
          </div>
        </main>
      </div>
    </ExpenseProvider>
  );
}

export default App;