exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createIndex("tasks", ["user_id", "status"]);
};

exports.down = (pgm) => {
  pgm.dropIndex("tasks", ["user_id", "status"]);
};