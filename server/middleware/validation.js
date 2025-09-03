import Joi from 'joi';

const expenseSchema = Joi.object({
  description: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 1 character',
    'string.max': 'Description must be less than 100 characters'
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be positive',
    'any.required': 'Amount is required'
  }),
  category: Joi.string().valid('Food', 'Transport', 'Shopping', 'Utilities', 'Healthcare', 'Entertainment', 'Other').required().messages({
    'any.only': 'Category must be one of: Food, Transport, Shopping, Utilities, Healthcare, Entertainment, Other',
    'any.required': 'Category is required'
  }),
});

export const validateExpense = (req, res, next) => {
  const { error } = expenseSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details[0].message
    });
  }
  
  next();
};