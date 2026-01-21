import request from '@/utils/request'

// 获取文章分类
export const articleGetCategory = () => request.get('/my/cate/list')

// 新增文章分类
export const articleAddCategory = ({ cate_name, cate_alias }) =>
  request.post('/my/cate/add', { cate_name, cate_alias })

// 编辑文章分类
export const articleEditCategory = ({ id, cate_name, cate_alias }) =>
  request.put('/my/cate/info', { id, cate_name, cate_alias })

// 删除文章分类
export const articleDelCategory = (id) =>
  request.delete('/my/cate/del', { params: { id } })

// 文章
// 获取文章列表
export const articleGetList = (params) =>
  request.get('/my/article/list', {
    params
  })

// 发布文章
export const articlePub = (params) => request.post('/my/article/add', params)

// 获取文章详情
export const articleGetDetail = (id) =>
  request.get('/my/article/info', { params: { id } })

// 编辑文章
export const articleEdit = (params) => request.put('/my/article/info', params)
