<script setup lang="ts">
import { useAuthStore } from "@/store";
import { ref, reactive } from "vue";
import type { FormRules, FormInst, FormValidationError } from "naive-ui";
import {
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NModal,
  useLoadingBar,
  NA,
  NSpace,
} from "naive-ui";

defineProps<{
  showModal: boolean;
}>();

const user = useAuthStore();
const loadingBar = useLoadingBar();

const formRef = ref<FormInst | null>(null);
const formValue = reactive({
  user: {
    email: "",
    password: "",
  },
});

const rules: FormRules = {
  user: {
    email: {
      required: true,
      message: "Email is required",
      trigger: "input",
    },
    password: {
      required: true,
      message: "Password is required",
      trigger: "input",
    },
  },
};

const submit = () => {
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (errors) {
      loadingBar.error();
      return;
    } else {
      loadingBar.start();
    }
  });

  // const payload = {
  //   email: formValue.user.email,
  //   password: formValue.user.password,
  // };

  // let { data, error } = authStore.signup(payload);
};
</script>

<template>
  <n-modal v-modal:show="showModal" class="signUpModal">
    <n-card size="medium" :segmented="{ content: true, footer: 'soft' }">
      <n-form
        ref="formRef"
        label-placement="left"
        label-width="auto"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item label="Email" path="user.email" :show-require-mark="false">
          <n-input placeholder="Email" v-model:value="formValue.user.email" />
        </n-form-item>
        <n-form-item label="Password" path="user.password" :show-require-mark="false">
          <n-input
            type="password"
            placeholder="Password"
            v-model:value="formValue.user.password"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="space-around">
          <n-button @click.prevent="submit({ newUser: false })">Login</n-button>
          <n-button @click.prevent="submit({ newUser: true })"
            >Create an account</n-button
          >
        </n-space>
      </template>
    </n-card>
    <n-a href class="forgetPasswordLink">Forgot your password?</n-a>
  </n-modal>
</template>

<style scoped lang="scss">
.signUpModal {
  display: flex;
  flex-direction: column;
}
.buttonContainer {
  display: flex;
  justify-content: space-around;
}
.forgetPasswordLink {
  margin-top: 20px;
  text-align: end;
}
</style>
