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
import { OrdersService } from "../application/orders.service";

const passport = require("passport");

@Controller("/orders")
export class OrdersController {
  constructor(private readonly application: OrdersService) {}
  @Post("/create_order_with_address_and_card")
  createOrderWithAddressAndCard(@Req() req: any, @Res() res: any) {
    if (!process.env.OMISE_SECRET_KEY)
      return res.status(503).json({ message: "Payments are not configured" });
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.orderController.createOrderWithAddressAndCard,
      ],
      req,
      res,
    );
  }
  @Post("/create_order_with_selected_address_and_card")
  createOrderWithCardAndAddressId(@Req() req: any, @Res() res: any) {
    if (!process.env.OMISE_SECRET_KEY)
      return res.status(503).json({ message: "Payments are not configured" });
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.orderController.createOrderWithCardAndAddressId,
      ],
      req,
      res,
    );
  }
  @Post("/create_order_with_selected_card_and_address")
  createOrderWithCardIdAndAddress(@Req() req: any, @Res() res: any) {
    if (!process.env.OMISE_SECRET_KEY)
      return res.status(503).json({ message: "Payments are not configured" });
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.orderController.createOrderWithCardIdAndAddress,
      ],
      req,
      res,
    );
  }
  @Post("/create_order_with_selected_card_and_selected_address")
  createOrderWithCardIdAndAddressId(@Req() req: any, @Res() res: any) {
    if (!process.env.OMISE_SECRET_KEY)
      return res.status(503).json({ message: "Payments are not configured" });
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.orderController.createOrderWithCardIdAndAddressId,
      ],
      req,
      res,
    );
  }
  @Put("/order_admin_edit_shipping_info/:orderId")
  orderAdminEditShippingInfo(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        this.application.orderController.orderAdminEditShippingInfo,
      ],
      req,
      res,
    );
  }
  @Get("/")
  getAllOrder(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAll", { session: false }),
        this.application.orderController.getAllOrder,
      ],
      req,
      res,
    );
  }
  @Get("/getOrderItemById/:id")
  getOrderItemById(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAll", { session: false }),
        this.application.orderController.getOrderItemById,
      ],
      req,
      res,
    );
  }
}
