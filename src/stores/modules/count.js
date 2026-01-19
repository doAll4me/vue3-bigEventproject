import { defineStore } from 'pinia'
import { ref } from 'vue'

// count模块相关的状态
export const useCountStore = defineStore(
  'big-user',
  () => {
    const count = ref(100) //token数据
    const setCount = (n) => {
      count.value += n
    }

    return {
      count,
      setCount
    }
  },
  {
    persist: true //持久化
  }
)
