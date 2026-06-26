const userService = require("../services/user.service");
const keyboard = require("../keyboards/main.keyboard");

module.exports = async (bot, msg) => {
  try {
    const telegramId = msg.from.id;
    const firstName = msg.from.first_name;
    const username = msg.from.username || null;

    const user = await userService.registerUser(
      telegramId,
      firstName,
      username,
    );

    await bot.sendMessage(
      msg.chat.id,
      `👋 Assalomu alaykum ${user.first_name}

Todo Botga xush kelibsiz.`,
      keyboard,
    );
  } catch (err) {
    console.log(err);
  }
};
