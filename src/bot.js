require("dotenv").config();

const { TelegramBot } = require("node-telegram-bot-api");
const userService = require("./services/user.service");
const userRepository = require("./repositories/user.repository");
const taskService = require("./services/task.service");
const messageHandler = require("./handlers/message.handler");

const pool = require("./db");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

console.log("🤖 Bot ishga tushdi...");

const startHandler = require("./handlers/start.handler");
const tasksKeyboard = require("./keyboards/task.keyboard");

bot.onText(/\/start/, (msg) => {
  startHandler(bot, msg);
});
bot.on("message", async (msg) => {
  await messageHandler(bot, msg);
});

bot.on("callback_query", async (query) => {
  try {
    const data = query.data;
    const telegramId = query.from.id;
    const user = await userRepository.findByTelegramId(telegramId);

    if (!user) return;

    if (data.startsWith("task_")) {
      const taskId = Number(data.split("_")[1]);
      const task = await taskService.getTaskById(taskId, user.id);

      if (!task) {
        return bot.answerCallbackQuery(query.id, { text: "Task topilmadi" });
      }

      return bot.editMessageText(
        `📌 Vazifa\n\n${task.title}\n\n${task.status ? "✅ Bajarilgan" : "❌ Jarayonda"}`,
        {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Tugatish", callback_data: `done_${task.id}` },
                { text: "🗑 O'chirish", callback_data: `delete_${task.id}` },
              ],
              [{ text: "🔙 Orqaga", callback_data: "back" }],
            ],
          },
        },
      );
    }

    if (data === "back" || data.startsWith("page_")) {
      const page = data.startsWith("page_") ? Number(data.split("_")[1]) : 0;

      const tasks = await taskService.getTasks(user.id);

      if (!tasks || tasks.length === 0) {
        await bot.answerCallbackQuery(query.id);
        return bot.editMessageText("📋 Sizda hozircha vazifalar yo'q.", {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
        });
      }

      const start = page * 10;
      const end = Math.min(start + 10, tasks.length);

      let text = `📋 Vazifalarim (${page + 1}-sahifa)\n\n`;

      for (let i = start; i < end; i++) {
        const task = tasks[i];
        text += `${i + 1}. ${task.title} ${task.status ? "✅" : "❌"}\n`;
      }

      await bot.answerCallbackQuery(query.id);

      return bot.editMessageText(text, {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        ...tasksKeyboard(tasks, page),  
      });
    }

    if (data.startsWith("done_")) {
      const id = Number(data.split("_")[1]);
      await taskService.completeTask(id, user.id);
      await bot.answerCallbackQuery(query.id, { text: "✅ Bajarildi" });

      return bot.editMessageText("✅ Vazifa bajarildi.", {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
      });
    }

    if (data.startsWith("delete_")) {
      const id = Number(data.split("_")[1]);
      await taskService.deleteTask(id, user.id);
      await bot.answerCallbackQuery(query.id, { text: "🗑 O'chirildi" });

      return bot.editMessageText("🗑 Vazifa o'chirildi.", {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
