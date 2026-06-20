const authService = require('../services/authService');

class AuthController {
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      const result = await authService.register(username, email, password);
      res.status(201).json({
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      if (error.message.includes('already exists') || error.code === '23505') { // 23505 is pg unique_violation
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.login(email, password);
      res.status(200).json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      res.status(200).json({
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      if (error.message.includes('Invalid refresh token') || error.message.includes('required')) {
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  }
}

module.exports = new AuthController();
