import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../../domain/product.repository";
const {
  Product,
  ProductImage,
  Sequelize,
} = require("../../../database/models");
@Injectable()
export class SequelizeProductRepository extends ProductRepository {
  async list(category: string) {
    const where =
      category === "All Product"
        ? {}
        : category.startsWith("search:")
          ? { name: { [Sequelize.Op.substring]: category.slice(7) } }
          : { cetagory: category };
    return Product.findAll({
      where,
      include: [ProductImage],
      limit: 100,
      order: [["createdAt", "DESC"]],
    });
  }
}
