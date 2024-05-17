import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from '../Common/Dto/pagination-query.dto';
import { CategoryEntity } from '../Entity/category.entity';
import { ProductEntity } from '../Entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './Dto/create-product.dto';
import { UpdateProductDto } from './Dto/update-product.dto';
import { AwsService } from '../Common/Service/aws.service';
import {
  ISerializeResponse,
  serializerService,
} from '../Common/Service/serializer.service';
import { ResponseMessage } from '../Common/Types/request';
import { ProductImage } from './product';
import { CartEntity } from 'src/Entity/cart.entity';

// import mime from 'mime-types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly awsService: AwsService,
  ) {}

  async getAllProducts(
    paginationQuery: PaginationQueryDto,
  ): Promise<ISerializeResponse<ProductEntity[]>> {
    const { limit, offset } = paginationQuery;
    const products = await this.productRepository.find({
      skip: offset,
      take: limit,
    });
    return serializerService.serializeResponse<ProductEntity[]>(
      'product_list',
      products,
    );
  }

  async getProductsByCategoryId(
    categoryId: string,
  ): Promise<ISerializeResponse<ProductEntity[]>> {
    try {
      const products = await this.productRepository.find({
        relations: ['category'],
        where: {
          category: {
            id: categoryId,
          },
        },
      });
      return serializerService.serializeResponse<ProductEntity[]>(
        'product_list',
        products,
      );
    } catch (err) {
      throw new BadRequestException(`Given id is not valid`);
    }
  }

  async getProduct(id: string): Promise<ISerializeResponse<ProductEntity>> {
    const product: ProductEntity = await this.findProductById(id);
    return serializerService.serializeResponse('product_detail', product);
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ISerializeResponse<ProductEntity>> {
    //check if there is same product
    const existedProduct = await this.productRepository.findOneBy({
      name: createProductDto.name,
    });
    if (existedProduct) {
      throw new ConflictException(`Same product already existed`);
    }

    const category = await this.preloadCategoryByName(
      createProductDto.category,
    );

    const product = await this.productRepository.save({
      ...createProductDto,
      category,
    });
    return serializerService.serializeResponse<ProductEntity>(
      'product_detail',
      product,
    );
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ISerializeResponse<ProductEntity>> {
    const category =
      updateProductDto.category &&
      (await this.preloadCategoryByName(updateProductDto.category));
    await this.findProductById(id);
    let newProduct: ProductEntity = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      category,
    });
    newProduct = await this.productRepository.save(newProduct);
    return serializerService.serializeResponse<ProductEntity>(
      'product_detail',
      newProduct,
    );
  }

  async removeProduct(
    id: string,
  ): Promise<ISerializeResponse<ResponseMessage>> {
    const product: ProductEntity = await this.findProductById(id);
    const cartItems: CartEntity[] = await this.cartRepository.find({
      where: {
        product: {
          id: id,
        },
      },
      relations: ['product'],
    });
    await this.cartRepository.remove(cartItems);
    if (product.imagePath) {
      const imagePath: string = product.imagePath.substring(
        product.imagePath.lastIndexOf('/'),
      );
      this.awsService.deleteImage(imagePath, 'products');
    }
    await this.productRepository.remove(product);
    return serializerService.serializeResponse<ResponseMessage>('successMsg', {
      status: 'ok',
      message: 'Product has been removed',
    });
  }

  async uploadProductImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<ISerializeResponse<ProductImage>> {
    const product: ProductEntity = await this.findProductById(id);
    if (product.imagePath) {
      const imagePath: string = product.imagePath.substring(
        product.imagePath.lastIndexOf('/'),
      );
      try {
        this.awsService.deleteImage(imagePath, 'products');
      } catch (err) {}
    }
    const imagePath: string = `${product.id}-${file.originalname}`;
    const imageUrl: string = this.awsService.uploadImage(
      imagePath,
      'products',
      file,
    );
    product.imagePath = imageUrl;
    await this.productRepository.save(product);
    return serializerService.serializeResponse<ProductImage>('product_image', {
      imagePath: imageUrl,
    });
  }

  private async preloadCategoryByName(name: string): Promise<CategoryEntity> {
    try {
      const Category = await this.categoryRepository.findOneBy({ name });
      if (!Category) {
        throw new NotFoundException('There is no such category');
      }
      return Category;
    } catch (err) {
      throw new NotFoundException('There is no such category');
    }
  }

  private async findProductById(id: string): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: id },
        relations: ['category'],
      });
      if (!product) {
        throw new NotFoundException(`Product not found`);
      }
      return product;
    } catch (err) {
      throw new NotFoundException(`Product not found`);
    }
  }
}
