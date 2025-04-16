import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomException } from './common/filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new CustomException());

  app.enableCors();

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Language Learning API')
    .setDescription('API cho ứng dụng học ngôn ngữ')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Nhập token JWT của bạn',
    })
    .addTag('Authentications', 'Xác thực người dùng')
    .addTag('Người dùng', 'Quản lý thông tin người dùng')
    .addTag('Ngôn ngữ', 'Quản lý các ngôn ngữ')
    .addTag('Chủ đề từ vựng', 'Quản lý các chủ đề từ vựng')
    .addTag('Từ vựng', 'Quản lý các từ vựng')
    .addTag('Bài tập', 'Quản lý các bài tập')
    .addTag('Câu hỏi bài tập', 'Quản lý các câu hỏi trong bài tập')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
    },
  });

  console.log(
    `Swagger is running on: http://localhost:${process.env.PORT ?? 3000}/api`,
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
