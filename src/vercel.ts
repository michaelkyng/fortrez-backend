// src/vercel.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import express, { Express } from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Cache the serverless handler
let cachedHandler: any = null;

async function bootstrap() {
  if (!cachedHandler) {
    const expressApp: Express = express();
    const adapter = new ExpressAdapter(expressApp);

    const app = await NestFactory.create(AppModule, adapter);

    // Global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // CORS - Enable this if needed
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Swagger
    const config = new DocumentBuilder()
      .setTitle('Fortrez API')
      .setDescription('The Fortrez crowdfunding platform API documentation')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    await app.init();

    // Create the serverless handler
    cachedHandler = serverlessExpress({ app: expressApp });
  }

  return cachedHandler;
}

// Vercel entrypoint
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await bootstrap();
  return server(req, res);
}