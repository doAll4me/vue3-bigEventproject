<script setup>
import { articleGetCategory } from '@/api/article'
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: [Number, String]
  }
})

const emit = defineEmits(['update:modelValue'])

const categoryList = ref([])
const getCategoryList = async () => {
  const res = await articleGetCategory()
  categoryList.value = res.data.data
  // console.log(categoryList.value)
}
getCategoryList()
</script>

<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width: '200px' }"
  >
    <el-option
      v-for="item in categoryList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>
