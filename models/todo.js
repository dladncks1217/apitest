module.exports = (sequelize, DataTypes) =>
  sequelize.define("todo", {
    content: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    isChecked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
