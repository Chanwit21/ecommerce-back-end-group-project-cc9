import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Req,
  Res,
} from "@nestjs/common";
import { ProductsService } from "../application/products.service";

const passport = require("passport");
const { upload } = require("../../middleware/multer.js");

@Controller(["/products", "/product"])
export class ProductsController {
  constructor(private readonly application: ProductsService) {}
  @Get("/byProductName/:productName")
  getProductById(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.productController.getProductById],
      req,
      res,
    );
  }
  @Get("/arrival")
  getProductNewArrival(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.productController.getProductNewArrival],
      req,
      res,
    );
  }
  @Post("/checkFavorite")
  checkFavorite(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAll", { session: false }),
        this.application.productController.checkFavorite,
      ],
      req,
      res,
    );
  }
  @Post("/favorite")
  createFavorite(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAll", { session: false }),
        this.application.productController.createFavorite,
      ],
      req,
      res,
    );
  }
  @Post("/cart")
  createCartItem(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAll", { session: false }),
        this.application.productController.createCartItem,
      ],
      req,
      res,
    );
  }
  @Delete("/favorite/:productId")
  deleteFavorite(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAll", { session: false }),
        this.application.productController.deleteFavorite,
      ],
      req,
      res,
    );
  }
  @Get("/")
  getProductAll(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        this.application.productController.getProductAll,
      ],
      req,
      res,
    );
  }
  @Delete("/:productId")
  deleteProduct(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        this.application.productController.deleteProduct,
      ],
      req,
      res,
    );
  }
  @Post("/")
  createNewProduct(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        upload.array("imageUrl", 7),
        this.application.productController.createNewProduct,
      ],
      req,
      res,
    );
  }
  @Get("/productImage/:productId")
  getProductImageByProductId(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        this.application.productController.getProductImageByProductId,
      ],
      req,
      res,
    );
  }
  @Put("/:productId")
  updateProduct(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        upload.array("imageUrl", 7),
        this.application.productController.updateProduct,
      ],
      req,
      res,
    );
  }
  @Get("/readyToShip/:productId")
  readyToShip(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        this.application.productController.readyToShip,
      ],
      req,
      res,
    );
  }
  @Get("/all_product/products")
  getAllProductByCategory(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.productController.getAllProductByCategory],
      req,
      res,
    );
  }
  @Get("/favorite/All")
  getAllFavoriteProduct(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.productController.getAllFavoriteProduct,
      ],
      req,
      res,
    );
  }
  @Get("/feature_product/All")
  getFeatureProduct(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.productController.getFeatureProduct],
      req,
      res,
    );
  }
  @Get("/best_seller/All")
  getBestSellerProduct(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.productController.getBestSellerProduct],
      req,
      res,
    );
  }
}
