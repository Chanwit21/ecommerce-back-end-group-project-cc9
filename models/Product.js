const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },
      cetagory: {
        type: DataTypes.STRING,
        allowNUll: false,
      },
      colorName: {
        type: DataTypes.STRING,
        allowNUll: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNUll: false,
      },
      count_stock: {
        type: DataTypes.STRING,
        allowNUll: false,
      },
      ingredient: {
        type: DataTypes.STRING,
        allowNUll: false,
      },
      productInfo: {
        type: DataTypes.STRING,
        allowNUll: false,
      },
    },
    { tableName: "products", underscored: true }
  );

  Product.associate = (models) => {
    Product.hasMany(models.OrderItem, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Product.hasMany(models.CartItem, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Product.hasMany(models.FavoriteProduct, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Product.hasMany(models.ProductImage, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Product;
};
