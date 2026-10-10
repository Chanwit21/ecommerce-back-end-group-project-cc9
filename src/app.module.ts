import { Module, Controller, Get } from "@nestjs/common";
import { OrdersModule } from "./orders/orders.module";
import { ProductsModule } from "./products/products.module";
import { CartModule } from "./cart/cart.module";
import { UsersModule } from "./users/users.module";
import { ContactsModule } from "./contacts/contacts.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { CardsModule } from "./cards/cards.module";
import { AddressesModule } from "./addresses/addresses.module";
import { LocationsModule } from "./locations/locations.module";
@Controller()
class HealthController {
  @Get("health") health() {
    return { status: "ok", service: "ecommerce" };
  }
}
@Module({
  controllers: [HealthController],
  imports: [
    OrdersModule,
    ProductsModule,
    CartModule,
    UsersModule,
    ContactsModule,
    TransactionsModule,
    CardsModule,
    AddressesModule,
    LocationsModule,
  ],
})
export class AppModule {}
