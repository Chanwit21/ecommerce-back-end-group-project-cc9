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
import { CartService } from "../application/cart.service";

const passport = require("passport");

@Controller("/carts")
export class CartController {
  constructor(private readonly application: CartService) {}
  @Get("/")
  getAllCartItem(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.cartController.getAllCartItem,
      ],
      req,
      res,
    );
  }
  @Post("/")
  addCartItem(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.cartController.addCartItem,
      ],
      req,
      res,
    );
  }
  @Post("/cart_item/:cartItemId")
  updateCartItemById(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.cartController.updateCartItemById,
      ],
      req,
      res,
    );
  }
  @Delete("/cart_item/:cartItemId")
  deleteCartItemById(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.cartController.deleteCartItemById,
      ],
      req,
      res,
    );
  }
}
