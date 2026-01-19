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

    return {
      token,
      setToken,
      removeToken
    }
  },
  {
    persist: true //持久化
  }
)
