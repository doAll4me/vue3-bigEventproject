import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块相关的状态
// token,setToken,removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('') //token数据
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    // 用户数据
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      // console.log(res.data.data)
      user.value = res.data.data
    }
    const setUser = (obj) => {
      user.value = obj
    }

    return {
      token,
      setToken,
      removeToken,

      user,
      getUser,
      setUser
    }
  },
  {
    persist: true //持久化
  }
)
