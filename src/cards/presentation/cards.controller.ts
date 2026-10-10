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
import { CardsService } from "../application/cards.service";

const passport = require("passport");

@Controller(["/cards", "/credit_cards"])
export class CardsController {
  constructor(private readonly application: CardsService) {}
  @Get("/")
  getAllCreditCard(@Req() req: any, @Res() res: any) {
    if (!process.env.OMISE_SECRET_KEY)
      return res.status(503).json({ message: "Payments are not configured" });
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.creditCardController.getAllCreditCard,
      ],
      req,
      res,
    );
  }
  @Post("/")
  AddCreditCard(@Req() req: any, @Res() res: any) {
    if (!process.env.OMISE_SECRET_KEY)
      return res.status(503).json({ message: "Payments are not configured" });
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.creditCardController.AddCreditCard,
      ],
      req,
      res,
    );
  }
  @Post("/:cardId")
  DeleteCreditCard(@Req() req: any, @Res() res: any) {
    if (!process.env.OMISE_SECRET_KEY)
      return res.status(503).json({ message: "Payments are not configured" });
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.creditCardController.DeleteCreditCard,
      ],
      req,
      res,
    );
  }
}
