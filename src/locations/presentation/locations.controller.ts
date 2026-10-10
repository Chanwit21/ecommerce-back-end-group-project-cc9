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
import { LocationsService } from "../application/locations.service";

const passport = require("passport");

@Controller("/locations")
export class LocationsController {
  constructor(private readonly application: LocationsService) {}
  @Get("/province")
  getAllProvince(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.locationController.getAllProvince,
      ],
      req,
      res,
    );
  }
  @Get("/district/:provinceId")
  getDistrictByProvinceId(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.locationController.getDistrictByProvinceId,
      ],
      req,
      res,
    );
  }
  @Get("/sub_district/:amphurId")
  getSubDistrictByDistrictId(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.locationController.getSubDistrictByDistrictId,
      ],
      req,
      res,
    );
  }
  @Get("/postal_code/:amphurId")
  getPostalCode(@Req() req: any, @Res() res: any) {
    return this.application.execute(
      [
        passport.authenticate("jwtCustomer", { session: false }),
        this.application.locationController.getPostalCode,
      ],
      req,
      res,
    );
  }
}
