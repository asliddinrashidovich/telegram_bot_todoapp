function tasksKeyboard(tasks, page = 0) {
  const start = page * 10;
  const end = Math.min(start + 10, tasks.length);

  const buttons = [];

  for (let i = start; i < end; i += 5) {
    const row = [];

    for (let j = i; j < i + 5 && j < end; j++) {
      row.push({
        text: String(j + 1),
        callback_data: `task_${tasks[j].id}`,
      });
    }

    buttons.push(row);
  }

  const nav = [];

  if (page > 0) {
    nav.push({
      text: "⬅️",
      callback_data: `page_${page - 1}`,
    });
  }

  if (end < tasks.length) {
    nav.push({
      text: "➡️",
      callback_data: `page_${page + 1}`,
    });
  }

  if (nav.length) {
    buttons.push(nav);
  }

  return {
    reply_markup: {
      inline_keyboard: buttons,
    },
  };
}

module.exports = tasksKeyboard;
