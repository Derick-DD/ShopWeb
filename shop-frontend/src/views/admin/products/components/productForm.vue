<template>
  <el-form :model="productForm" ref="productRef" :rules="productRules" label-width="120px">
    <el-form-item label="Product Name" prop="name">
      <el-input v-model="productForm.name" />
    </el-form-item>
    <el-form-item label="Category" prop="category">
      <el-select v-model="productForm.category" placeholder="please select the category">
        <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.name" />
      </el-select>
    </el-form-item>
    <el-form-item label="Price" prop="price">
      <el-input-number v-model="productForm.price" :precision="2" :min="0" :step="1" />
    </el-form-item>
    <el-form-item label="Description">
      <el-input v-model="productForm.description" type="textarea" />
    </el-form-item>

    <el-form-item label="Picture" prop="imagePath">
      <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="handleFile" drag>
        <img v-if="productForm.imagePath" :src="productForm.imagePath" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        <template #tip>
          <div class="el-upload__tip">Only JPG/PNG/GIF files, within 10MB</div>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit(productRef)">{{ ifUpdate ? 'Update' : 'Create' }}</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules, UploadFile, UploadProps } from 'element-plus';
  import { createProduct, findOneProduct, updateProduct, uploadProductPic } from '@/api/product';
  import { findAllCategoris } from '@/api/category';
  import { ElMessage } from 'element-plus';
  import { CategoryInfo } from '@/api/category/types';

  export interface ProductForm {
    name: string;
    category: string;
    price: number;
    description: string;
    imagePath: string;
  }
  const productRef = ref<FormInstance>();
  const productForm = reactive<ProductForm>({
    name: '',
    category: '',
    price: 0,
    description: '',
    imagePath: '',
  });
  const storedFile: Ref<UploadFile | null> = ref(null);
  const categories: Ref<CategoryInfo[]> = ref([]);

  //transorm to update
  const ifUpdate = ref(false);

  const router = useRouter();
  const params = router.currentRoute.value.params as { id: string };
  const currentId = params.id;

  onMounted(async () => {
    if (currentId) {
      const res = await findOneProduct(currentId);
      const productDetails = res.data.attributes;
      productForm.name = productDetails.name;
      productForm.category = productDetails.category.name;
      productForm.price = productDetails.price;
      productForm.description = productDetails.description;
      productForm.imagePath = productDetails.imagePath;
      ifUpdate.value = true;
    }
    const res = await findAllCategoris();
    categories.value = res.data.attributes;
  });

  const productRules = reactive<FormRules<ProductForm>>({
    name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
    category: [{ required: true, message: 'Please select category', trigger: 'change' }],
    price: [
      {
        validator: (_rules, value, callback) => {
          if (value > 0) {
            callback();
          } else {
            callback(new Error('Price must be greater than 0'));
          }
        },
        trigger: 'blur',
        required: true,
      },
    ],
    imagePath: [{ required: true, message: 'Please upload Picture', trigger: 'blur' }],
  });

  const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        if (storedFile.value === null && ifUpdate.value === false) {
          ElMessage.error('please upload picture');
          return false;
        }
        try {
          if (ifUpdate.value) {
            const res = await updateProduct(currentId, productForm);
            if (res.code === 200) {
              if (storedFile.value) {
                const file_res = await uploadProductPic(res.data.attributes.id, storedFile.value);
                if (file_res.data.attributes) {
                  ElMessage.success('Form has been submited');
                } else {
                  ElMessage.error('Image is not uploaded for unexpected reason, please try again later');
                }
              } else {
                ElMessage.success('Form has been submited');
              }
            }
          } else {
            const res = await createProduct(productForm);
            if (res.code === 200) {
              const file_res = await uploadProductPic(res.data.attributes.id, storedFile.value);
              if (file_res.data.attributes) {
                ElMessage.success('Form has been submited');
              } else {
                ElMessage.error('Image is not uploaded');
              }
            }
          }
        } catch (err) {
          return;
        }
      } else {
        ElMessage({
          message: 'please fill all required inputs',
          type: 'error',
          duration: 5 * 1000,
          showClose: true,
        });
      }
    });
  };

  // upload file

  const handleFile: UploadProps['onChange'] = async (file: UploadFile) => {
    const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif'];
    const isImage = acceptedFormats.includes(file.raw!.type);
    const isLt10M = file.size! / 1024 / 1024 < 10;
    if (!isImage) {
      ElMessage.error('Only jpg/png/gif are accepted');
      return false;
    }
    if (!isLt10M) {
      ElMessage.error('No more than 10 MB');
      return false;
    }
    productForm.imagePath = URL.createObjectURL(file.raw!);
    storedFile.value = file;
  };
</script>

<style scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
