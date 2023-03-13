import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOption = {
    orgin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    allowedHeaders : 'Content-Type, Accept , Authorization',
  };

  app.enableCors(corsOption);

  await app.listen(3000);
}
bootstrap();
