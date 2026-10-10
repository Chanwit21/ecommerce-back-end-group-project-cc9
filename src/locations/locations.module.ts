import { Module } from "@nestjs/common";
import { LocationsController } from "./presentation/locations.controller";
import { LocationsService } from "./application/locations.service";
@Module({ controllers: [LocationsController], providers: [LocationsService] })
export class LocationsModule {}
