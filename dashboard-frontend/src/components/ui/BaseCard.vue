<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
<div class="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
    <div v-if="title" class="mb-4">
      <h2 class="text-cyan-100 text-lg font-semibold">
        {{ title }}
      </h2>
      <p v-if="description" class="text-gray-400 text-sm mt-1">
        {{ description }}
      </p>
    </div>

    <slot />
  </div>
</template>