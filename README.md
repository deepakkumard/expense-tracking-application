# MERN Stack Expense Tracker

A full-featured expense tracking application built with MongoDB, Express.js, React, and Node.js.

## Features

- Add, edit, and delete expenses
- Real-time expense summary with category breakdown
- Filter expenses by category
- Interactive pie chart visualization
- Responsive design for all devices
- Toast notifications for user feedback
- Fast and intuitive user interface

## Tech Stack

- Frontend: React 18, JavaScript, Tailwind CSS, Recharts, React Toastify
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Validation: express-validator
- Development: Vite, Concurrently, Nodemon

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB installation)

### Database Setup

1. Create a MongoDB Atlas account at [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

This will start both the frontend (React) and backend (Express) servers concurrently.

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

- `GET /api/expenses` - Get all expenses (with optional category filter)
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense
- `GET /api/expenses/summary` - Get expense summary with totals and category breakdown

## Project Structure

```
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── expenseController.js
│   ├── middleware/
│   │   └── validation.js
│   ├── models/
│   │   └── Expense.js
│   ├── routes/
│   │   └── expenses.js
│   └── server.js
├── src/
│   ├── components/
│   │   ├── ExpenseChart.jsx
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── ExpenseSummary.jsx
│   │   └── Header.jsx
│   ├── context/
│   │   └── ExpenseContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Usage

1. Add Expenses: Use the form to add new expenses with description, amount, category, and date
2. View Expenses: All expenses are displayed in a sortable list with edit and delete options
3. Filter: Use the category dropdown to filter expenses
4. Summary: View total spending and category breakdown
5. Charts: Visualize your spending distribution with an interactive pie chart
6. Edit: Click the edit button on any expense to modify it
