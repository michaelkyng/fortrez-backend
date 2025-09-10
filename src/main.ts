// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply shared configuration
  configureApp(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

// Only call bootstrap if this file is being executed directly
if (require.main === module) {
  bootstrap().catch((error) => {
    console.error('Error starting the application:', error);
    process.exit(1);
  });
}