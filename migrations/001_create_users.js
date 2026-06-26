exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    telegram_id: {
      type: "bigint",
      notNull: true,
      unique: true,
    },

    first_name: {
      type: "varchar(100)",
      notNull: true,
    },

    username: {
      type: "varchar(100)",
    },

    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("users", "telegram_id");
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
