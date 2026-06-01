<script setup lang="ts">
defineProps<{
  type?: "success" | "error" | "info"
  message: string
}>()
</script>

<template>
  <div
    class="p-4 rounded-lg border text-sm"
    :class="{
      'bg-green-950/30 border-green-500/30 text-green-400': type === 'success',
      'bg-red-950/30 border-red-500/30 text-red-400': type === 'error',
      'bg-blue-950/30 border-blue-500/30 text-blue-400': type === 'info'
    }"
  >
    {{ message }}
  </div>
</template>