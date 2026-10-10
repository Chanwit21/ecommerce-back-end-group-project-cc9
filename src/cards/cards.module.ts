import { Module } from "@nestjs/common";
import { CardsController } from "./presentation/cards.controller";
import { CardsService } from "./application/cards.service";
@Module({ controllers: [CardsController], providers: [CardsService] })
export class CardsModule {}
