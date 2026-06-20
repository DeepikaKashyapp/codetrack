const db = require('../config/db');

class ProblemRepository {
  async create(title, slug, difficulty, platform, tags) {
    const query = `
      INSERT INTO problems (title, slug, difficulty, platform, tags)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [title, slug, difficulty, platform, tags];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async findAll(limit, offset, difficulty, tags) {
    let query = 'SELECT * FROM problems WHERE 1=1';
    const values = [];
    let counter = 1;

    if (difficulty) {
      query += ` AND difficulty = $${counter++}`;
      values.push(difficulty);
    }

    if (tags && tags.length > 0) {
      query += ` AND tags && $${counter++}`; // && operator checks for array overlap
      values.push(tags);
    }

    query += ` ORDER BY id ASC LIMIT $${counter++} OFFSET $${counter++}`;
    values.push(limit, offset);

    const { rows } = await db.query(query, values);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM problems WHERE 1=1';
    const countValues = [];
    let countCounter = 1;

    if (difficulty) {
      countQuery += ` AND difficulty = $${countCounter++}`;
      countValues.push(difficulty);
    }

    if (tags && tags.length > 0) {
      countQuery += ` AND tags && $${countCounter++}`;
      countValues.push(tags);
    }

    const { rows: countRows } = await db.query(countQuery, countValues);
    
    return {
      data: rows,
      total: parseInt(countRows[0].count, 10)
    };
  }

  async findById(id) {
    const query = 'SELECT * FROM problems WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = new ProblemRepository();
