<script setup>
import { articleGetList } from '@/api/article'
import { formatTime } from '@/utils/format'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ArticleEdit from './components/ArticleEdit.vue'
import CategorySelect from './components/CategorySelect.vue'
// 假数据
// const articleList = ref([
//   {
//     id: 5961,
//     title: '新的文章啊',
//     pub_date: '2022-07-10 14:53:52.604',
//     state: '已发布',
//     cate_name: '体育'
//   },
//   {
//     id: 5962,
//     title: '新的文章啊',
//     pub_date: '2022-07-10 14:54:30.904',
//     state: '草稿',
//     cate_name: '体育'
//   }
// ])
const loading = ref(false)
const articleList = ref([])
const total = ref(0)
// 定义请求参数对象
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

// 请求文章列表
const getArticleList = async () => {
  loading.value = true
  // console.log(params.value)

  const res = await articleGetList(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()

// 分页逻辑
const onSizeChange = (size) => {
  // 每页条数变化，则要从第一页开始渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

// 搜索（筛选 逻辑
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 添加文章
const articleEditRef = ref()
const onAddArticle = () => {
  articleEditRef.value.open({}) //需要传一个空对象作为参数
}

// 编辑文章
const onEditAriticle = (row) => {
  articleEditRef.value.open(row)
  // console.log(row)
}

// 删除文章
const onDeleteArticle = (row) => {
  console.log(row)
}

// 添加文章或编辑文章成功后刷新页面
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加文章，渲染显示最后一页
    params.value.pagenum = Math.ceil((total.value + 1) / params.value.pagesize)
  }
  // 如果是编辑文章，直接渲染即可
  getArticleList(params.value)
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <button type="primary" @click="onAddArticle">添加文章</button>
    </template>

    <!-- 表单区域 -->
    <el-form inline :style="{ width: '100%' }">
      <el-form-item label="文章分类：">
        <category-select v-model="params.cate_id"></category-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state" :style="{ width: '200px' }">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading" style="width: 100%">
      <el-table-column label="文章标题" prop="title" width="400">
        <!-- 作用域插槽 -->
        <template #default="{ row }">
          <el-link type="primary" underline="never"> {{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <!-- 自定义插槽 -->
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditAriticle(row)"
          >
          </el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页区 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style scoped>
.el-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
