import React, { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseChart from './components/ExpenseChart';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const expenseFormRef = useRef();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form and Summary */}
            <div className="lg:col-span-1 space-y-6">
              <ExpenseForm ref={expenseFormRef} />
              <ExpenseSummary />
              <ExpenseChart />
            </div>

            {/* Right Column - Expense List */}
            <div className="lg:col-span-2">
              <ExpenseList formRef={expenseFormRef} />
            </div>
          </div>
        </main>
      </div>
    </ExpenseProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
