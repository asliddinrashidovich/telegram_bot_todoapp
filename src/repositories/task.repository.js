const pool = require("../db");

async function getTaskById(id, userId) {
  const result = await pool.query(
    `
SELECT *
FROM tasks
WHERE id=$1
AND user_id=$2
`,

    [id, userId],
  );

  return result.rows[0];
}

async function createTask(userId, title) {
  const result = await pool.query(
    `
      INSERT INTO tasks (user_id, title)
      VALUES ($1, $2)
      RETURNING *
    `,
    [userId, title],
  );

  return result.rows[0];
}

async function getTasks(userId) {
  const result = await pool.query(
    `
      SELECT *
      FROM tasks
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId],
  );

  return result.rows;
}

async function completeTask(taskId, userId) {
  const result = await pool.query(
    `
      UPDATE tasks
      SET status = true
      WHERE id = $1
      AND user_id = $2
      RETURNING *
    `,
    [taskId, userId],
  );

  return result.rows[0];
}

async function deleteTask(taskId, userId) {
  await pool.query(
    `
      DELETE FROM tasks
      WHERE id = $1
      AND user_id = $2
    `,
    [taskId, userId],
  );
}

module.exports = {
  createTask,
  getTasks,
  completeTask,
  deleteTask,
  getTaskById,
};
