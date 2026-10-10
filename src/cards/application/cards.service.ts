import { Injectable } from "@nestjs/common";
import { invoke } from "../../handler-adapter";
@Injectable()
export class CardsService {
  readonly creditCardController = require("../infrastructure/legacy/handler.js");
  execute(handlers: any[], req: any, res: any) {
    return invoke(handlers, req, res);
  }
}
