import express from 'express';
import { 
  createExpense, 
  getAllExpenses, 
  deleteExpense, 
  getExpenseSummary,
  updateExpense,
  exportExpenses, 
  importExpenses 
} from '../controllers/expenseController.js';
import { validateExpense } from '../middleware/validation.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// GET /api/expenses - Get all expenses
router.get('/', getAllExpenses);

// POST /api/expenses - Create new expense
router.post('/', validateExpense, createExpense);

// PUT /api/expenses/:id - Update expense
router.put('/:id', validateExpense, updateExpense);

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', deleteExpense);

// GET /api/expenses/summary - Get expense summary
router.get('/summary', getExpenseSummary);

// format: csv or excel
router.get("/export/:format", exportExpenses);  
router.post("/import", upload.single("file"), importExpenses);

export default router;