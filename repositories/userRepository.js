const db = require('../config/db');

class UserRepository {
  async create(username, email, passwordHash) {
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at;
    `;
    const values = [username, email, passwordHash];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1;';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  async saveRefreshToken(userId, token) {
    const query = 'UPDATE users SET refresh_token = $1 WHERE id = $2;';
    await db.query(query, [token, userId]);
  }

  async findByRefreshToken(token) {
    const query = 'SELECT * FROM users WHERE refresh_token = $1;';
    const { rows } = await db.query(query, [token]);
    return rows[0];
  }
}

module.exports = new UserRepository();
