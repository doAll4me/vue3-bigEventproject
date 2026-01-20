<script setup>
import { useUserStore } from '@/stores'

const userState = useUserStore()
const { getUser } = userState
getUser()
</script>

<template>
  <div>个人详情</div>
</template>

<style scoped></style>
