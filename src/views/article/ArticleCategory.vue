<script setup>
import { articleDelCategory, articleGetCategory } from '@/api/article'
import CategoryEdit from '@/views/article/components/CategoryEdit.vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

const loading = ref(false)
const dialog = ref() //绑定弹窗组件

const categoryList = ref([])
const getCategoryList = async () => {
  // 数据还没获取到就显示加载效果
  loading.value = true
  const res = await articleGetCategory()
  categoryList.value = res.data.data
  loading.value = false
}
getCategoryList()

const onAddCategory = () => {
  dialog.value.open()
}

const onEditChannel = (row) => {
  console.log(row)
  dialog.value.open(row)
}

const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await articleDelCategory(row.id)
  ElMessage.success('删除成功')
  getCategoryList()
}

const onSuccess = () => {
  getCategoryList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <button @click="onAddCategory">新增分类</button>
    </template>
    <el-table v-loading="loading" :data="categoryList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <!-- 编辑按钮 -->
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <!-- 编辑/添加 弹窗 -->
    <category-edit ref="dialog" @success="onSuccess"></category-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
