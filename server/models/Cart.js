const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    tableName: "carts",
    underscored: true,
  },
);

module.exports = Cart;
