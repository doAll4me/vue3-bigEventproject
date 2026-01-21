<script setup>
import { userUpdatePwdService } from '@/api/user'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()

// 表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 表单实例
const formRef = ref()

// 基础校验规则：非空 + 6-15 位
const basePwdRule = [
  { required: true, message: '密码不能为空', trigger: 'blur' },
  { min: 6, max: 15, message: '密码长度必须为 6-15 位', trigger: 'blur' }
]

// 表单校验规则
const rules = {
  old_pwd: basePwdRule,

  new_pwd: [
    ...basePwdRule,
    {
      validator: (rule, value, callback) => {
        if (value === pwdForm.value.old_pwd) {
          callback(new Error('新密码不能与原密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],

  re_pwd: [
    ...basePwdRule,
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.value.new_pwd) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 提交表单
const onSubmit = async () => {
  try {
    await formRef.value.validate() //预校验
    userUpdatePwdService(pwdForm.value)

    // 密码修改成功后需要重新登录（清空本地数据
    userStore.removeToken()
    router.push('/login')
    ElMessage.success('密码修改成功，请重新登录')
  } catch (e) {
    // 校验失败时不需要额外处理
    ElMessage.error(e.message)
  }
}

// 重置表单
const onReset = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="pwdForm"
    :rules="rules"
    label-width="100px"
    style="max-width: 400px"
  >
    <!-- 原密码 -->
    <el-form-item label="原密码" prop="old_pwd">
      <el-input
        v-model="pwdForm.old_pwd"
        type="password"
        show-password
        placeholder="请输入原密码"
      />
    </el-form-item>

    <!-- 新密码 -->
    <el-form-item label="新密码" prop="new_pwd">
      <el-input
        v-model="pwdForm.new_pwd"
        type="password"
        show-password
        placeholder="请输入新密码"
      />
    </el-form-item>

    <!-- 确认密码 -->
    <el-form-item label="确认密码" prop="re_pwd">
      <el-input
        v-model="pwdForm.re_pwd"
        type="password"
        show-password
        placeholder="请再次输入新密码"
      />
    </el-form-item>

    <!-- 按钮 -->
    <el-form-item>
      <el-button type="primary" @click="onSubmit">修改密码</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
