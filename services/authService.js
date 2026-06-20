const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async register(username, email, password) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await userRepository.create(username, email, passwordHash);

    // Generate token
    const { accessToken, refreshToken } = this.generateTokens(newUser.id, newUser.username);
    await userRepository.saveRefreshToken(newUser.id, refreshToken);

    return { user: newUser, token: accessToken, refreshToken };
  }

  async login(email, password) {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const { accessToken, refreshToken } = this.generateTokens(user.id, user.username);
    await userRepository.saveRefreshToken(user.id, refreshToken);

    // Don't return password hash
    const { password_hash, refresh_token, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token: accessToken, refreshToken };
  }

  async refresh(token) {
    if (!token) throw new Error('Refresh token is required');
    
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if token exists in DB
      const user = await userRepository.findByRefreshToken(token);
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      const { accessToken, refreshToken } = this.generateTokens(user.id, user.username);
      await userRepository.saveRefreshToken(user.id, refreshToken);

      return { token: accessToken, refreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  generateTokens(id, username) {
    const accessToken = jwt.sign(
      { id, username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    const refreshToken = jwt.sign(
      { id, username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
