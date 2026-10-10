import { ProductRepository } from "./domain/product.repository";
import { SequelizeProductRepository } from "./infrastructure/persistence/sequelize-product.repository";
import { CatalogController } from "./presentation/catalog.controller";
import { Module } from "@nestjs/common";
import { ProductsController } from "./presentation/products.controller";
import { ProductsService } from "./application/products.service";
@Module({
  controllers: [ProductsController, CatalogController],
  providers: [
    ProductsService,
    { provide: ProductRepository, useClass: SequelizeProductRepository },
  ],
})
export class ProductsModule {}
