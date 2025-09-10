// api/index.ts
import { NestFactory } from '@nestjs/core';
import { configureApp } from '../src/app.config';
import { AppModule } from '../src/app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  
  // Apply shared configuration
  configureApp(app);
  
  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  await app.init();
  
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log('EVENT:', JSON.stringify(event, null, 2));
  
  if (!server) {
    try {
      server = await bootstrap();
    } catch (error) {
      console.error('Failed to bootstrap application:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Internal server error',
          error: error.message,
        }),
      };
    }
  }
  
  return server(event, context, callback);
};