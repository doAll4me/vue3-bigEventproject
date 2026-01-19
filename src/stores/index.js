// pinia独立维护
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// 也作为state的统一导出接口
// import { useCountStore } from './modules/count'
// import { useUserStore } from './modules/user'
// export { useCountStore, useUserStore }
export * from './modules/count.js'
export * from './modules/user.js'
