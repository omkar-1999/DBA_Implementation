<script setup>
defineProps({
  files: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['download'])
</script>

<template>
  <div v-if="files.length" class="mt-10 border-t pt-6">
    <h3 class="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
      Deployment Files
    </h3>

    <div
      v-for="(file, index) in files"
      :key="index"
      class="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-lg mb-3"
    >
      <p class="text-sm font-medium text-slate-800">
        {{ file.name }}
      </p>

      <button
        @click="$emit('download', file)"
        class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm"
      >
        Download
      </button>
    </div>
  </div>
</template>
