import request from '@/utils/request'

// 用户注册接口
// export const userRegisterService = async ({
//   username,
//   password,
//   repassword
// }) => {
//   const res = await request.post('/api/reg', {
//     username,
//     password,
//     repassword
//   })
//   console.log(res)
// }
// 简写
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 用户登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })
