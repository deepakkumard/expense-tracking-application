const API_BASE_URL = '/api';
const HARDCODED_USER_ID = 'user-123';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'An error occurred');
  }
  return response.json();
};

export const fetchExpenses = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  return handleResponse(response);
};

export const createExpense = async (expenseData) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...expenseData, userId: HARDCODED_USER_ID }),
  });
  return handleResponse(response);
};

export const updateExpense = async (id, expenseData) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...expenseData, userId: HARDCODED_USER_ID }),
  });
  return handleResponse(response);
};

export const deleteExpense = async (id) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const fetchExpenseSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses/summary`);
  return handleResponse(response);
};

export const exportExpenses = async (format = "csv") => {
  const response = await fetch(`${API_BASE_URL}/expenses/export/${format}`);
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

  const response = await fetch(`${API_BASE_URL}/expenses/import`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to import");
  return response.json();
};
