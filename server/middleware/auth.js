export const authenticateUser = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.body.userId;
  
  // Validate that the user is our hardcoded user
  if (userId !== 'user-123') {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid user credentials' 
    });
  }
  
  // Add user to request object
  req.user = {
    id: 'user-123',
    username: 'user-123',
    name: 'Demo User'
  };
  
  next();
};

// Middleware to extract user ID from headers
export const extractUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'User ID header is required' 
    });
  }
  
  req.userId = userId;
  next();
};