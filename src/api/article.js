import request from '@/utils/request'

// 获取文章分类
export const articleGetCategory = () => request.get('/my/cate/list')
