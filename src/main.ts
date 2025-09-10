import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();

  // Swagger configuration
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
      'JWT-auth', // This name is used as the key for the security requirement in the @ApiBearerAuth() decorator
    )
    .addServer(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger UI with custom configuration
  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const httpAdapter = app.getHttpAdapter();
    
    // Serve Swagger UI files
    httpAdapter.get('/api', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Fortrez API Documentation</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css">
          </head>
          <body>
            <div id="swagger-ui"></div>
            <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
            <script>
              window.onload = function() {
                window.ui = SwaggerUIBundle({
                  url: '/api-json',
                  dom_id: '#swagger-ui',
                  presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset
                  ],
                  layout: "BaseLayout",
                  deepLinking: true,
                  showExtensions: true,
                  showCommonExtensions: true,
                  docExpansion: 'none',
                  tagsSorter: 'alpha',
                  operationsSorter: 'alpha',
                  persistAuthorization: true
                });
              };
            </script>
          </body>
        </html>
      `);
    });

    // Serve the OpenAPI JSON
    httpAdapter.get('/api-json', (req, res) => {
      res.json(document);
    });
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on port ${process.env.PORT}`);
}
void bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
