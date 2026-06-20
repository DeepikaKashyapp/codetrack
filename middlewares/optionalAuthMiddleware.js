const jwt = require('jsonwebtoken');
require('dotenv').config();

const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Just ignore invalid tokens for optional auth
  }
  next();
};

module.exports = optionalAuthMiddleware;
