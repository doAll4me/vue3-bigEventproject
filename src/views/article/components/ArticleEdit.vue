<script setup>
import { articleEdit, articleGetDetail, articlePub } from '@/api/article'
import { baseURL } from '@/utils/request'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { nextTick, ref } from 'vue'
import CategorySelect from './CategorySelect.vue'
const visibleDrawer = ref(false)

// 表单默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
}

// 表单收集的数据
const formModel = ref({
  ...defaultForm
})

// 图片上传
const imageUrl = ref('')
const onSelectFile = (uploadFile) => {
  // console.log(uploadFile)
  // 基于前端创建本地预览的图片url
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state

  // 收集到的表单数据（普通对象）转成formData对象（数据结构一致
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  if (formModel.value.id) {
    // 编辑文章
    // console.log('编辑')
    await articleEdit(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false

    // 通知父组件修改成功
    emit('success', 'edit')
  } else {
    await articlePub(fd)
    console.log('添加文章')
    ElMessage.success('添加成功')
    visibleDrawer.value = false

    // 通知父组件添加成功
    emit('success', 'add')
  }
}

// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({}) =>表单无需渲染，说明是添加
// open({ id,cate_name,...}) =>表单需要渲染，说明是编辑
//open调用后，可以打开弹窗
// const quillEditor = ref() //富文本编辑器的钩子
const editorKey = ref(0)
const open = async (row) => {
  visibleDrawer.value = true
  //row.id存在就是编辑，不存在就是添加
  if (row.id) {
    // 如果是编辑文章，要进行内容回显
    const res = await articleGetDetail(row.id)
    // console.log(res.data.data)
    formModel.value = { ...res.data.data }
    // 封面要单独回显
    imageUrl.value = baseURL + formModel.value.cover_img

    // 【注意】：提交给后台需要的图片格式是file对象，需要将网络图片地址转化为file对象
    const file = await imageUrlToFile(imageUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    // 如果是添加文章，表单重置为空白
    formModel.value = { ...defaultForm }
    // 但图片显示和富文本编辑器需要手动重置
    imageUrl.value = ''
    await nextTick()
    editorKey.value++
    //
  }
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <category-select
          v-model="formModel.cate_id"
          width="100%"
        ></category-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 需要关闭element-plus的自动上传，因为要先本地预览，然后和其他数据一起上传 -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <!-- 富文本编辑器 -->
          <quill-editor
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
            :key="editorKey"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
