<template>
  <div class="min-h-screen flex justify-center items-center p-4">
    <UCard class="w-full md:w-1/2 p-6">
      <template #header>
     <h1 class="text-2xl font-semibold">Register</h1>
    </template>
        <form class="space-y-4" @submit.prevent="registerUser">
          <UFormField label="Name" required>
            <UInput v-model="name" class="w-full" type="text" :ui="{ base: (error && error != 'Passwords do not match') ? 'ring-red-500 ring-1' : '' }" placeholder="Enter your name" @input="error = ''" />
          </UFormField>
          <UFormField label="Email" required>
            <UInput v-model="email" class="w-full" type="email" :ui="{ base: (error && error != 'Passwords do not match') ? 'ring-red-500 ring-1' : '' }" placeholder="Enter your email" icon="i-lucide-at-sign" @input="error = ''" />
          </UFormField>
          <UFormField label="Password" required>
          <UInput v-model="password" class="w-full" :ui="{ base: error ? 'ring-red-500 ring-1' : '' }" :type="showPassword ? 'text' : 'password'" placeholder="Enter your password" required @input="error = ''" >
            <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :aria-pressed="showPassword"
        aria-controls="password"
        @click="showPassword = !showPassword"
      />
    </template>
          </UInput>
        </UFormField>
          <UFormField label="Repeat Password" required>
          <UInput v-model="repeatPassword" class="w-full" :ui="{ base: error ? 'ring-red-500 ring-1' : '' }" :type="showPassword ? 'text' : 'password'" placeholder="Repeat your password" required @input="error = ''" >
            <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :aria-pressed="showPassword"
        aria-controls="password"
        @click="showPassword = !showPassword"
      />
    </template>
          </UInput>
        </UFormField>
          <UButton type="submit" color="primary" size="xl" block>Create account</UButton>
        </form>
        <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
        <p class="mt-2">Already have an account?</p>
        <NuxtLink to="/login" class="underline text-sky-500">Log in</NuxtLink>
    </UCard></div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const name = ref('');
  const email = ref('');
  const showPassword = ref(false)
  const password = ref('');
  const repeatPassword = ref('');
  const error = ref('');
  
  async function registerUser() {
    if (password.value !== repeatPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }
    error.value = '';
    try {
      await $fetch.raw('/api/register', {
        method: 'POST',
        body: {
          name: name.value,
          email: email.value,
          password: password.value
        },
      }).then(async (res) => {
        const token = res.headers.get('Authorization')?.replace('Bearer ', '');
        document.cookie = `token=${token}; path=/; max-age=604800; secure; samesite=lax`
        await navigateTo('/dashboard');
      }).catch((err) => {
        error.value = err?.data?.message || 'Register failed';
      });
    } catch (err) {
      console.log(err)
    }
  }
  </script>
  