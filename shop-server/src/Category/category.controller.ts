import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDto } from './Dto/category.dto';

import { Roles } from '../Common/Decorators/roles.decorator';
import { Role } from '../Common/Enums/Roles';
import { ISerializeResponse } from '../Common/Service/serializer.service';
import { ResponseMessage } from '../Common/Types/request';
import { CategoryEntity } from '../Entity/category.entity';
import { Public } from '../Common/Decorators/public.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  async findAllCategoris(): Promise<ISerializeResponse<CategoryEntity[]>> {
    return this.categoryService.getAllCategories();
  }

  @Get('/detailed')
  async findAllInDetail(): Promise<ISerializeResponse<CategoryEntity[]>> {
    return this.categoryService.getAllCategoriesWithDetail();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ): Promise<ISerializeResponse<CategoryEntity>> {
    return this.categoryService.getCategory(id);
  }

  @ApiBearerAuth()
  @Post()
  @Roles(Role.Admin)
  create(
    @Body() categoryDto: CategoryDto,
  ): Promise<ISerializeResponse<CategoryEntity>> {
    return this.categoryService.createCategory(categoryDto.name);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() categoryDto: CategoryDto,
  ): Promise<ISerializeResponse<CategoryEntity>> {
    return this.categoryService.updateCategoryName(id, categoryDto.name);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.Admin)
  remove(
    @Param('id') id: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    return this.categoryService.removeCategory(id);
  }
}
