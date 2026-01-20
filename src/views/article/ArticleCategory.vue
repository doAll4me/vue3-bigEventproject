<script setup>
import { articleGetCategory } from '@/api/article'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'

const loading = ref(false)

const categoryList = ref([])
const getCategoryList = async () => {
  // 数据还没获取到就显示加载效果
  loading.value = true
  const res = await articleGetCategory()
  categoryList.value = res.data.data
  loading.value = false
}
getCategoryList()

const onEditChannel = (row) => {
  console.log(row)
}

const onDelChannel = (row) => {
  console.log(row)
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <button>新增分类</button>
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
  </page-container>
</template>

<style lang="scss" scoped></style>
