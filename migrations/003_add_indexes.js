exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createIndex("tasks", "user_id");
  pgm.createIndex("tasks", "status");
  pgm.createIndex("tasks", ["user_id", "status"]);
};

exports.down = (pgm) => {
  pgm.dropIndex("tasks", ["user_id", "status"]);
  pgm.dropIndex("tasks", "status");
  pgm.dropIndex("tasks", "user_id");
};
