import { Module } from "@nestjs/common";
import { OrdersController } from "./presentation/orders.controller";
import { OrdersService } from "./application/orders.service";
@Module({ controllers: [OrdersController], providers: [OrdersService] })
export class OrdersModule {}
