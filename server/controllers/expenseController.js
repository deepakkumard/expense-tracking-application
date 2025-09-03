import Expense from '../models/Expense.js';
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import XLSX from "xlsx";
import fs from "fs";

const HARDCODED_USER_ID = 'user-123';

// GET /api/expenses
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ date: -1 }) // Sort by most recent first
      .lean();
    
    // Convert _id to id for frontend compatibility
    const formattedExpenses = expenses.map(expense => ({
      ...expense,
      id: expense._id.toString(),
      _id: undefined
    }));
    
    res.json(formattedExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

// POST /api/expenses
export const createExpense = async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    
    const newExpense = new Expense({
      description,
      amount: parseFloat(amount),
      category,
      userId: req.user.id || HARDCODED_USER_ID,
      date: new Date()
    });
    
    const savedExpense = await newExpense.save();
    
    const formattedExpense = {
      ...savedExpense.toObject(),
      id: savedExpense._id.toString(),
      _id: undefined
    };
    
    res.status(201).json(formattedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.message 
      });
    }
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

// PUT /api/expenses/:id
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category } = req.body;
    
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id  || HARDCODED_USER_ID},
      {
        description,
        amount: parseFloat(amount),
        category
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    const formattedExpense = {
      ...updatedExpense.toObject(),
      id: updatedExpense._id.toString(),
      _id: undefined
    };
    
    res.json(formattedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.message 
      });
    }
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

// DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedExpense = await Expense.findOneAndDelete({ 
      _id: id, 
      userId: req.user.id || HARDCODED_USER_ID
    });
    
    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

// GET /api/expenses/summary
export const getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).lean();
    
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const byCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    res.json({ total, byCategory });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch expense summary' });
  }
};

// Export expenses (CSV/Excel)
export const exportExpenses = async (req, res) => {
  try {
    const { format } = req.params;
    if (!["xlsx", "csv"].includes(format)) {
      return res.status(400).json({ error: "Invalid format" });
    }

    const expenses = await Expense.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");

    // Columns
    worksheet.columns = [
      { header: "Description", key: "description", width: 30 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Category", key: "category", width: 20 },
      { header: "Date", key: "date", width: 20 },
    ];

    // Rows
    expenses.forEach((exp) => {
      worksheet.addRow({
        description: exp.description,
        amount: exp.amount,
        category: exp.category,
        date: exp.date ? exp.date.toISOString().split("T")[0] : "",
      });
    });

    if (format === "xlsx") {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=expenses.xlsx"
      );
      await workbook.xlsx.write(res);
      res.end();
    } else if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=expenses.csv"
      );
      await workbook.csv.write(res);
      res.end();
    }
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Export failed" });
  }
};

function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

// Import expenses from Excel/CSV
export const importExpenses = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!rows.length) return res.status(400).json({ error: "File is empty" });

    const expenses = rows.map(row => {
      let dateValue = row.Date || row.date;
      let parsedDate = new Date();

      if (dateValue) {
        if (typeof dateValue === "number") {
          parsedDate = excelDateToJSDate(dateValue);
        } else {
          const timestamp = Date.parse(dateValue);
          parsedDate = isNaN(timestamp) ? new Date() : new Date(timestamp);
        }
      }

      return {
        description: row.Description || row.description || "No description",
        amount: Number(row.Amount || row.amount || 0),
        category: row.Category || row.category || "Other",
        userId: HARDCODED_USER_ID,
        date: parsedDate,
      };
    });

   await Expense.insertMany(expenses);

    fs.unlinkSync(filePath);
    res.json({ message: "Expenses imported successfully", count: expenses.length, expenses });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ error: error.message });
  }
};