exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("tasks", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },

    title: {
      type: "varchar(255)",
      notNull: true,
    },

    status: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createIndex("tasks", "user_id");
  pgm.createIndex("tasks", "status");
};

exports.down = (pgm) => {
  pgm.dropTable("tasks");
};
