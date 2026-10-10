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
import { TransactionsService } from "../application/transactions.service";
const transactionController = require("../infrastructure/legacy/handler.js");
const passport = require("passport");

@Controller(["/transactions", "/transaction"])
export class TransactionsController {
  constructor(private readonly application: TransactionsService) {}
  @Get("/")
  getOrderByTime(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        transactionController.getOrderByTime,
      ],
      req,
      res,
    );
  }
}
