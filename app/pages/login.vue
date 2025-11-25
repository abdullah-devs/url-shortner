<template>
  <div class="min-h-screen flex justify-center items-center p-4">
    <UCard class="w-full md:w-1/2 p-6">
      <template #header>
     <h1 class="text-2xl font-semibold">Login</h1>
    </template>
        <form class="space-y-4" @submit.prevent="loginUser">
          <UFormField label="Email" required>
            <UInput v-model="email" class="w-full" type="email" :ui="{ base: error ? 'ring-red-500 ring-1' : '' }" placeholder="Enter your email" icon="i-lucide-at-sign" @input="error = ''" />
          </UFormField>
          <UFormField label="Password" required>
          <UInput v-model="password" class="w-full" :ui="{ base: error ? 'ring-red-500 ring-1' : '' }" type="password" placeholder="Enter your password" required @input="error = ''" />
        </UFormField>
          <UButton type="submit" color="primary" size="xl" block>Login</UButton>
        </form>
        <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
        <p class="mt-2">Don't have an account?</p>
        <NuxtLink to="/register" class="underline text-sky-500">Create an account</NuxtLink>
    </UCard></div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const email = ref('');
  const password = ref('');
  const error = ref('');
  
  async function loginUser() {
    error.value = '';
    try {
      await $fetch.raw('/api/login', {
        method: 'POST',
        body: {
          email: email.value,
          password: password.value
        },
      }).then(async (res) => {
        const token = res.headers.get('Authorization')?.replace('Bearer ', '');
        document.cookie = `token=${token}; path=/; max-age=604800; secure; samesite=lax`
        await navigateTo('/dashboard');
      }).catch((err) => {
        error.value = err?.data?.message || 'Login failed';
      });
    } catch (err) {
      console.log(err)
    }
  }
  </script>
  