import { ProductRepository } from "../domain/product.repository";
import { Injectable } from "@nestjs/common";
import { invoke } from "../../handler-adapter";
@Injectable()
export class ProductsService {
  constructor(private readonly products: ProductRepository) {}
  list(category: string) {
    return this.products.list(category);
  }
  readonly productController = require("../infrastructure/legacy/handler.js");
  execute(handlers: any[], req: any, res: any) {
    return invoke(handlers, req, res);
  }
}
