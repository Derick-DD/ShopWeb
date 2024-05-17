import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../Entity/category.entity';
import { Repository } from 'typeorm';
import {
  ISerializeResponse,
  serializerService,
} from '../Common/Service/serializer.service';
import { ResponseMessage } from '../Common/Types/request';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getAllCategories(): Promise<ISerializeResponse<CategoryEntity[]>> {
    const categories = await this.categoryRepository.find();
    return serializerService.serializeResponse<CategoryEntity[]>(
      'category_list',
      categories,
    );
  }

  async getAllCategoriesWithDetail(): Promise<
    ISerializeResponse<CategoryEntity[]>
  > {
    const categories = await this.categoryRepository.find({
      relations: ['products'],
    });
    return serializerService.serializeResponse<CategoryEntity[]>(
      'category_list',
      categories,
    );
  }

  async getCategory(id: string): Promise<ISerializeResponse<CategoryEntity>> {
    const category: CategoryEntity = await this.findCategoryById(id);
    return serializerService.serializeResponse<CategoryEntity>(
      'category_detail',
      category,
    );
  }

  async createCategory(
    name: string,
  ): Promise<ISerializeResponse<CategoryEntity>> {
    const category = await this.categoryRepository.findOneBy({ name });
    if (category) {
      throw new ConflictException(`Category #${name} already existed`);
    }
    const newCategory = await this.categoryRepository.save({ name });
    return serializerService.serializeResponse<CategoryEntity>(
      'category_detail',
      newCategory,
    );
  }

  async updateCategoryName(
    id: string,
    name: string,
  ): Promise<ISerializeResponse<CategoryEntity>> {
    const oldCategory: CategoryEntity = await this.findCategoryById(id);
    const Category = await this.categoryRepository.preload({
      ...oldCategory,
      name: name,
    });
    const newCategory = await this.categoryRepository.save(Category);
    return serializerService.serializeResponse<CategoryEntity>(
      'category_detail',
      newCategory,
    );
  }

  async removeCategory(
    id: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    let category: CategoryEntity;
    try {
      category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['products'],
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    } catch (err) {
      throw new BadRequestException('Given id is not valid');
    }

    if (category.products && category.products.length > 0) {
      throw new BadRequestException(`Category still contains products`);
    }
    this.categoryRepository.remove(category);
    return serializerService.serializeResponse<ResponseMessage>('responseMsg', {
      status: 'ok',
      message: 'Category has been removed',
    });
  }

  private async findCategoryById(id: string): Promise<CategoryEntity> {
    try {
      const category = await this.categoryRepository.findOneBy({ id });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (err) {
      throw new NotFoundException('Category not found');
    }
  }
}
