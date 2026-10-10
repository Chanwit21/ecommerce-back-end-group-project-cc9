import { Module } from "@nestjs/common";
import { ContactsController } from "./presentation/contacts.controller";
import { ContactsService } from "./application/contacts.service";
@Module({ controllers: [ContactsController], providers: [ContactsService] })
export class ContactsModule {}
