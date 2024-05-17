// Nest dependencies
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

// Other dependencies
// import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf';
import helmet from 'helmet';

// Local files
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './Filters/exception.filter';
import { ResTransformInterceptor } from './Interceptors/resTransfrom.interceptor';
// import { configService } from './Common/Service/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  //used request header for token to replace cookie
  // app.use(cookieParser());
  // app.use(csurf());
  app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResTransformInterceptor());

  //cors
  // app.enableCors({
  //   origin: 'https://api-m.sandbox.paypal.com',
  // });

  const options = new DocumentBuilder()
    .setTitle('ShopXX')
    .setDescription('eShop application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
