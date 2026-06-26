const tasksKeyboard = require("../keyboards/task.keyboard");
const taskKeyboard = require("../keyboards/task.keyboard");
const userRepository = require("../repositories/user.repository");
const taskService = require("../services/task.service");
const userStates = require("../states/user.state");

module.exports = async (bot, msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  const text = msg.text;

  if (text.startsWith("/")) return;

  const user = await userRepository.findByTelegramId(telegramId);

  if (!user) {
    return;
  }

  if (userStates[telegramId] === "waiting_task") {
    await taskService.createTask(user.id, text);

    delete userStates[telegramId];

    return bot.sendMessage(chatId, "✅ Vazifa qo'shildi.");
  }

  switch (text) {
    case "➕ Vazifa qo'shish":
      userStates[telegramId] = "waiting_task";

      return bot.sendMessage(chatId, "📝 Vazifa nomini yuboring.");

    case "📋 Vazifalarim": {
      const tasks = await taskService.getTasks(user.id);

      if (!tasks.length) {
        return bot.sendMessage(chatId, "📭 Sizda vazifalar yo'q.");
      }

      let text = "📋 Vazifalarim (1-sahifa)\n\n";
      const firstPageTasks = tasks.slice(0, 10);

      firstPageTasks.forEach((task, index) => {
        text += `${index + 1}. ${task.title} ${task.status ? "✅" : "❌"}\n`;
      });

      return bot.sendMessage(chatId, text, tasksKeyboard(tasks));
    }

    case "📊 Statistika": {
      const tasks = await taskService.getTasks(user.id);

      const total = tasks.length;

      const completed = tasks.filter((t) => t.status).length;

      const active = total - completed;

      return bot.sendMessage(
        chatId,
        `📊 Statistika

📌 Jami: ${total}

✅ Bajarilgan: ${completed}

❌ Jarayonda: ${active}`,
      );
    }
  }
};
