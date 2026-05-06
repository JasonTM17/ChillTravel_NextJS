import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./modules/app.module";
import { configureApiApp } from "./modules/api.setup";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApiApp(app);
  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });

  const config = new DocumentBuilder()
    .setTitle("VIETWANDER AI API")
    .setDescription("Vietnam and world travel intelligence API with mock payments and local AI gateway.")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(Number(process.env.PORT ?? 4000));
}

void bootstrap();
