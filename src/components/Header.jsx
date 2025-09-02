import React from 'react';
import { DollarSign } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-sm text-gray-600">Manage your daily expenses</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;