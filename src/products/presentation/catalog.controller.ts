import { Controller, Get, Query } from "@nestjs/common";
import { ProductsService } from "../application/products.service";
@Controller("catalog")
export class CatalogController {
  constructor(private readonly service: ProductsService) {}
  @Get() async list(@Query("category") category = "All Product") {
    return { products: await this.service.list(category) };
  }
}
