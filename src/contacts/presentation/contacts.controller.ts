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
import { ContactsService } from "../application/contacts.service";

const passport = require("passport");
@Controller(["/contacts", "/contactUs"])
export class ContactsController {
  constructor(private readonly application: ContactsService) {}
  @Get("/")
  getAllContactUs(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        this.application.contactUsController.getAllContactUs,
      ],
      req,
      res,
    );
  }
  @Post("/")
  createContactUs(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.contactUsController.createContactUs],
      req,
      res,
    );
  }
  @Delete("/:id")
  deleteContactUsById(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAdmin", { session: false }),
        this.application.contactUsController.deleteContactUsById,
      ],
      req,
      res,
    );
  }
}
