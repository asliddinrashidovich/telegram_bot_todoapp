const pool = require("../db");

async function findByTelegramId(telegramId) {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE telegram_id = $1
    `,
    [telegramId],
  );

  return result.rows[0];
}

async function createUser(telegramId, firstName, username) {
  const result = await pool.query(
    `
    INSERT INTO users
    (telegram_id, first_name, username)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [telegramId, firstName, username],
  );

  return result.rows[0];
}

module.exports = {
  findByTelegramId,
  createUser,
};
