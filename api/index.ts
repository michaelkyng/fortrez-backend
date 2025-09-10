// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module';
import { configureApp } from '../dist/app.config';
import serverlessExpress from '@vendia/serverless-express';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedServer: any = null;

async function createServer() {
  if (!cachedServer) {
    try {
      console.log('Creating NestJS server...');
      
      const app = await NestFactory.create(AppModule);
      
      // Apply shared configuration
      configureApp(app);
      
      await app.init();
      console.log('NestJS app initialized');
      
      // Get the Express instance
      const expressApp = app.getHttpAdapter().getInstance();
      
      // Create serverless handler
      cachedServer = serverlessExpress({ app: expressApp });
      console.log('Serverless express handler created');
      
    } catch (error) {
      console.error('Error creating server:', error);
      throw error;
    }
  }
  
  return cachedServer;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`Handling ${req.method} ${req.url}`);
    
    const server = await createServer();
    return server(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}