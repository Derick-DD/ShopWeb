import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './Product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from './User/user.module';
import { CategoryModule } from './Category/category.module';
import { AuthModule } from './auth/auth.module';
import { configService } from './Common/Service/config.service';
import { CartModule } from './Cart/cart.module';
import { OrderModule } from './Order/order.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './Guards/roles.guard';
import { JwtAuthGuard } from './Guards/jwt-auth.guard';

@Module({
  imports: [
    ProductModule,
    MulterModule.register({
      dest: 'uploads',
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    CategoryModule,
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
