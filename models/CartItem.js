const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      isSelectToPay: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      quality: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: "cart_items", underscored: true }
  );

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
      foreignKey: {
        name: "cartId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    CartItem.belongsTo(models.Product, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return CartItem;
};
