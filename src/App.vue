<script setup>
import { useUserStore } from '@/stores/modules/user'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const { token } = storeToRefs(useUserStore())
const { setToken, removeToken } = useUserStore()

console.log(router)
console.log(route)
</script>

<template>
  <div>
    <router-view></router-view>
    <hr />
    <hr />
    <hr />
    APP
    <p>{{ token }}</p>
    <el-button @click="setToken('apindspivhiph')">登录</el-button>
    <el-button @click="removeToken">退出</el-button>
    <test-demo></test-demo>
  </div>
</template>

<style scoped></style>
