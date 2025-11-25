<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { getCookie } from '../utils';

const links = ref<{ id: number, name: string, link: string, public_id: string, visit_count: number }[]>([]);

const token = getCookie('token');

    const { data, refresh, pending } = await useFetch('/api/links', {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    watchEffect(() => {
        if (data.value) {
            links.value = data.value as { id: number, name: string, link: string, public_id: string, visit_count: number }[]
        }
    })

    refresh();

    function logout() {
    document.cookie = `token=; path=/; max-age=0; secure; samesite=lax`;
    navigateTo('/login');
    }
</script>

<template>
    <div class="p-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-medium">Dashboard</h1>
            <div>
                <CreateLink class="mr-2" @success="refresh"  />  
                <UButton label="Logout" color="error" variant="subtle" @click="logout" />
            </div>
        </div>
        <div v-if="pending" class="flex flex-wrap gap-2">
            <USkeleton v-for="(link) in [0, 1, 2]" :key="link" class="p-1 h-32 rounded-md w-full md:w-56" />
        </div>
        <div v-else class="flex flex-wrap gap-2">
        <div v-for="(link) in links" :key="link.id" class="p-4 border border-muted rounded-md w-full md:w-auto">
            <div class="flex gap-2 justify-between"><h1 class="text-lg font-medium">{{ link.name }}</h1>
            <DeleteLink :id="link.id" @success="refresh" /></div>
            <NuxtLink :to="`/${link.public_id}`" class="flex items-center gap-0.5 text-sky-500 underline">{{ link.link }} <UIcon name="i-lucide-square-arrow-out-up-right" class="size-4 mt-1" /></NuxtLink>
            <p>Visits: {{ link.visit_count }}</p>
        </div>
        </div>
    </div>
</template>