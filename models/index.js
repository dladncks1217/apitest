const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Todo = require("./todo")(sequelize, Sequelize);

db.Todo.belongsTo(db.User, { foreignKey: "userId" });
db.User.hasMany(db.Todo, { foreignKey: "userId" });

module.exports = db;
