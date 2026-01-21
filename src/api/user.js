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

// 获取用户信息接口
export const userGetInfoService = () => request.get(`/my/userinfo`)

// 更新用户基本资料接口
export const userUpdateInfoService = (data) => request.put('/my/userinfo', data)

// 更新用户头像接口
export const userUpdateAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 更新用户密码
export const userUpdatePwdService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
