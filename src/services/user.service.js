const userRepository = require("../repositories/user.repository");

async function registerUser(telegramId, firstName, username) {
  let user = await userRepository.findByTelegramId(telegramId);

  if (!user) {
    user = await userRepository.createUser(telegramId, firstName, username);
  }

  return user;
}

module.exports = {
  registerUser,
};
