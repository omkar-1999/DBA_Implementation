<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchCurrentUser()
})
</script>

<template>
  <router-view />
</template>
