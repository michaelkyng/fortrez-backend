// src/vercel.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import express, { Express } from 'express';
import serverlessExpress from '@vendia/serverless-express';
import { VercelRequest, VercelResponse } from '@vercel/node';

// cache the express instance instead of lambda handler
let cachedApp: Express | null = null;
let cachedServer: ReturnType<typeof serverlessExpress> | null = null;

async function bootstrap(): Promise<ReturnType<typeof serverlessExpress>> {
  if (!cachedServer) {
    const expressApp: Express = express();
    const adapter = new ExpressAdapter(expressApp);

    const app = await NestFactory.create(AppModule, adapter);

    // global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // // CORS
    // app.enableCors({
    //   origin: true,
    //   credentials: true,
    // });

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

    cachedApp = expressApp;
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer!;
}

// Vercel entrypoint: (req, res) style
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await bootstrap();

  // ✅ Instead of passing (event, context, callback),
  // just pass req & res directly (express mode)
  return (cachedApp as Express)(req, res);
}
