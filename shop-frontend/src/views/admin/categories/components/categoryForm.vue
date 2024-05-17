<template>
  <el-container>
    <el-main>
      <el-form :model="categoryForm" ref="categoryRef" :rules="categoryRules" label-width="120px">
        <el-form-item label="Category Name" prop="name">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(categoryRef)">{{ ifUpdate ? 'Update' : 'Create' }}</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus';
  import { createCategory, findOneCategory, updateCategory } from '@/api/category';
  import { ElMessage } from 'element-plus';

  export interface CategoryForm {
    name: string;
  }
  const categoryRef = ref<FormInstance>();
  const categoryForm = reactive<CategoryForm>({
    name: '',
  });

  //transorm to update
  const ifUpdate = ref(false);

  const router = useRouter();
  const params = router.currentRoute.value.params as { id: string };
  const currentId = params.id;

  onMounted(async () => {
    if (currentId) {
      const res = await findOneCategory(currentId);
      categoryForm.name = res.data.attributes.name;
      ifUpdate.value = true;
    }
  });

  const categoryRules = reactive<FormRules<CategoryForm>>({
    name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
  });

  const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          if (ifUpdate.value) {
            const res = await updateCategory(currentId, categoryForm);
            if (res.code === 200) {
              ElMessage.success('Form has been submited');
            }
          } else {
            const res = await createCategory(categoryForm);
            if (res.code === 200) {
              ElMessage.success('Form has been submited');
            }
          }
        } catch (err) {
          return;
        }
      } else {
        ElMessage({
          message: 'please fill name',
          type: 'error',
          duration: 5 * 1000,
          showClose: true,
        });
      }
    });
  };
</script>
<style scoped></style>
