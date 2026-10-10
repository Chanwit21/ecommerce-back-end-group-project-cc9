import { Injectable } from "@nestjs/common";
import { invoke } from "../../handler-adapter";
@Injectable()
export class TransactionsService {
  execute(handlers: any[], req: any, res: any) {
    return invoke(handlers, req, res);
  }
}
