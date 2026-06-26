const taskRepository = require("../repositories/task.repository");

async function getTaskById(id, userId) {
  return taskRepository.getTaskById(id, userId);
}

async function createTask(userId, title) {
  return await taskRepository.createTask(userId, title);
}

async function getTasks(userId) {
  return await taskRepository.getTasks(userId);
}

async function completeTask(taskId, userId) {
  return await taskRepository.completeTask(taskId, userId);
}

async function deleteTask(taskId, userId) {
  return await taskRepository.deleteTask(taskId, userId);
}

module.exports = {
  createTask,
  getTasks,
  completeTask,
  deleteTask,
  getTaskById,
};
