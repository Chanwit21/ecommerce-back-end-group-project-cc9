import { Module } from "@nestjs/common";
import { AddressesController } from "./presentation/addresses.controller";
import { AddressesService } from "./application/addresses.service";
@Module({ controllers: [AddressesController], providers: [AddressesService] })
export class AddressesModule {}
