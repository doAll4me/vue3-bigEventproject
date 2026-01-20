<script setup>
import { articleAddCategory, articleEditCategory } from '@/api/article'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const dialogVisible = ref(false)
const form = ref()

const formModel = ref({
  cate_name: '',
  cate_alias: ''
})

const rules = {
  cate_name: [
    { required: true, message: '请输入有效类名', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入有效类名', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ]
}

// 组件对外暴露方法open，根据open传来的参数区分是要进行什么操作（添加 编辑
//open({}) => 表单无渲染，添加
// open({id,cate_name,...}) =>表单需要渲染，编辑
const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row } //编辑类别时数据回显
}

// 提交弹窗表单
const emit = defineEmits(['success'])
const submit = async () => {
  await form.value.validate() //预校验
  const isEdit = formModel.value.id
  // 编辑
  if (isEdit) {
    await articleEditCategory(formModel.value)
    ElMessage.success('编辑成功')
  }
  // 新增
  else {
    await articleAddCategory(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false //关闭弹窗
  emit('success') //告诉父组件添加/编辑成功，需要进行数据更新
}

// 向外暴露
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑文章分类' : '新增文章分类'"
    width="500"
    :before-close="handleClose"
  >
    <el-form
      :model="formModel"
      :rules="rules"
      ref="form"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
