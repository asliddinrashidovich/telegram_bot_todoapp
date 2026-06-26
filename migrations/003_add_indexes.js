exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createIndex("tasks", ["user_id", "status"], {
    name: "tasks_user_status_idx",
  });
};

exports.down = (pgm) => {
  pgm.dropIndex("tasks", ["user_id", "status"], {
    name: "tasks_user_status_idx",
  });
};
