import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { config } from 'dotenv';

import { AppModule } from './app.module';
const mainLogger = new Logger('Bootstrap');

async function bootstrap() {

  /**
   * Load environment variables
   * @see .env - file on root folder for configurations
   */
  config();

  const app = await NestFactory.create(AppModule);

  /** Configure app instance */
  app.enableCors();
  app.setGlobalPrefix(process.env.APP_ROOT);
  app.useGlobalPipes(new ValidationPipe());

  /** Configure Swagger Module */
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Multi User Web API Project')
    .setDescription('The Back-end Project Multi-User Systems.')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`${process.env.APP_ROOT}/docs`, app, document);

  /** Run app instance on a port */
  await app.listen(process.env.APP_PORT, () => {
    mainLogger.log(`${process.env.NODE_ENV}: api running on "PORT" ${process.env.APP_PORT} with "PATH" ${process.env.APP_ROOT}`);
  });
}
bootstrap();
