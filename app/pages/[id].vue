<script setup lang="ts">

const route = useRoute()

const { data, pending, error, status } = await useFetch(`/api/link/${route.params.id}`);

if (status.value === "success") {
    navigateTo((data.value as {link: string}).link, { external: true } );
}
</script>

<template>
  <div v-if="!pending && error?.statusCode === 404" class="p-8 flex justify-center items-center flex-col gap-4 h-screen">
    <h1 class="text-7xl font-medium text-primary">404</h1>
    <p class="text-neutral-400 text-lg">Link not found</p>
  </div>
</template>