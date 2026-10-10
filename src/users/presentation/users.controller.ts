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
import { UsersService } from "../application/users.service";

const passport = require("passport");

const { upload } = require("../../middleware/multer.js");

@Controller("/users")
export class UsersController {
  constructor(private readonly application: UsersService) {}
  @Post("/login")
  login(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.authController.login],
      req,
      res,
    );
  }
  @Post("/register")
  register(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.authController.register],
      req,
      res,
    );
  }
  @Post("/login/google")
  loginWithGoogle(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.authController.loginWithGoogle],
      req,
      res,
    );
  }
  @Post("/login/facebook")
  loginWithFacebook(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [this.application.authController.loginWithFacebook],
      req,
      res,
    );
  }
  @Put("/")
  editUserInformation(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAll", { session: false }),
        upload.single("imageUrl"),
        this.application.authController.editUserInformation,
      ],
      req,
      res,
    );
  }
  @Get("/:id")
  getUserById(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtAll", { session: false }),
        this.application.authController.getUserById,
      ],
      req,
      res,
    );
  }
}
