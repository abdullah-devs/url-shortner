<template>
    <UModal v-model:open="open" title="Create a New Link">
      <UButton label="Create a Link" color="neutral" variant="subtle" />
  
      <template #body>
        <form class="space-y-4" @submit.prevent="createLink">
          <UFormField label="Name" required>
            <UInput v-model="name" class="w-full" type="text" :ui="{ base: error ? 'ring-red-500 ring-1' : '' }" placeholder="Enter url name" @input="error = ''" />
          </UFormField>
          <UFormField label="Link" required>
          <UInput v-model="link" class="w-full" :ui="{ base: error ? 'ring-red-500 ring-1' : '' }" type="text" placeholder="https://example.com" required @input="error = ''" />
        </UFormField>
          <UButton type="submit" color="primary" size="xl" block>Create Link</UButton>
        </form>
        <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
      </template>
    </UModal>
  </template>

<script setup lang="ts">
import { ref } from 'vue';
import { getCookie } from '../utils';

const open = ref(false)

const name = ref('');
const link = ref('');
const error = ref('');

const emit = defineEmits(['success'])

async function createLink() {
  const token = getCookie('token');

  error.value = '';
  try {
    await $fetch.raw('/api/link', {
      method: 'POST',
      body: {
        name: name.value,
        link: link.value
      },
      headers: {
        Authorization: `Bearer ${token}`
      },
    }).then(() => {
      emit('success')
      open.value = false;
    }).catch((err) => {
      error.value = err?.data?.message || 'Link Creation failed';
    });
  } catch (err) {
    console.log(err)
  }
}
</script>
