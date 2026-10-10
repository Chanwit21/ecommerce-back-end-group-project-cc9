import { Module } from "@nestjs/common";
import { TransactionsController } from "./presentation/transactions.controller";
import { TransactionsService } from "./application/transactions.service";
@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
