import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Catch, ArgumentsHost, ExceptionFilter } from "@nestjs/common";
require("dotenv").config();
require("./config/passport.js");
const { AppModule } = require("./app.module");
@Catch()
class ErrorFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res
      .status(error.statusCode || error.status || 500)
      .json({
        message:
          error.statusCode || error.status ? error.message : "Request failed",
      });
  }
}
async function bootstrap() {
  require("fs").mkdirSync("data", { recursive: true });
  const app = await NestFactory.create(AppModule);
  app.use(require("passport").initialize());
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:3200",
  });
  app.use(
    "/uploads",
    require("express").static(require("path").resolve("public/uploads")),
  );
  app.useGlobalFilters(new ErrorFilter());
  await require("./database/models").sequelize.authenticate();
  await app.listen(Number(process.env.PORT || 4200), "127.0.0.1");
}
bootstrap();
