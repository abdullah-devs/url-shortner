<template>
    <UModal v-model:open="open" title="Are you sure you want to delete this link?">
      <UButton icon="i-lucide-trash-2" color="neutral" variant="subtle" size="sm" />
  
      <template #body>
        <div class="flex gap-2">
          <UButton type="submit" color="error" size="xl" block @click="deleteLink">Delete</UButton>
          <UButton type="submit" color="primary" size="xl" block @click="open = false">Cancel</UButton>
        </div>
      </template>
    </UModal>
  </template>

<script setup lang="ts">
import { ref } from 'vue';
import { getCookie } from '../utils';

const open = ref(false)

const props = defineProps<{ id: number }>()
const emit = defineEmits(['success'])

async function deleteLink() {
  const token = getCookie('token');

  try {
    await $fetch.raw(`/api/link/${props.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      },
    }).then(() => {
      emit('success')
      open.value = false;
    });
  } catch (err) {
    console.log(err)
  }
}
</script>
