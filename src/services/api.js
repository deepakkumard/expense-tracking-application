const API_BASE_URL = '/api';
const HARDCODED_USER_ID = 'user-123';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    'Content-Type': 'application/json',
    'x-user-id': user.id || 'user-123'
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'An error occurred');
  }
  return response.json();
};

export const fetchExpenses = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const createExpense = async (expenseData) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(expenseData),
  });
  return handleResponse(response);
};

export const updateExpense = async (id, expenseData) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(expenseData),
  });
  return handleResponse(response);
};

export const deleteExpense = async (id) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};


export const fetchExpenseSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses/summary`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const exportExpenses = async (format = "csv") => {
  const response = await fetch(`${API_BASE_URL}/expenses/export/${format}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error("Failed to export");

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = format === "csv" ? "expenses.csv" : "expenses.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const importExpenses = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const headers = {
    'x-user-id': 'user-123'
  };

  const response = await fetch('/api/expenses/import', {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.details || error.error || "Failed to import");
  }

  return response.json();
};

