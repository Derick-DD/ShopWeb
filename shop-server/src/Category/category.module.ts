import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../Entity/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../Guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class CategoryModule {}
