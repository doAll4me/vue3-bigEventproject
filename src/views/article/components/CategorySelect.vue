<script setup>
import { articleGetCategory } from '@/api/article'
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: [Number, String]
  },
  // 调用时自定义组件样式 也需要用props
  width: {
    type: String
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
    :style="{ width }"
  >
    <el-option
      v-for="item in categoryList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>
