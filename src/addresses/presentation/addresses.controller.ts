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
import { AddressesService } from "../application/addresses.service";

const passport = require("passport");

@Controller(["/addresses", "/address"])
export class AddressesController {
  constructor(private readonly application: AddressesService) {}
  @Get("/")
  getAllAddress(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.addressController.getAllAddress,
      ],
      req,
      res,
    );
  }
  @Post("/")
  createAddress(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.addressController.createAddress,
      ],
      req,
      res,
    );
  }
  @Delete("/:id")
  deleteAddressById(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.addressController.deleteAddressById,
      ],
      req,
      res,
    );
  }
  @Put("/:id")
  updateAddressById(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.addressController.updateAddressById,
      ],
      req,
      res,
    );
  }
}
