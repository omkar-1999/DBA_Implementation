<script setup>
import { buildApiAssetUrl } from '@/utils/urlUtils'

defineProps({
  screenshots: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['preview'])
</script>

<template>
  <div v-if="screenshots.length" class="mt-10 border-t pt-6">
    <h3 class="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Screenshots</h3>

    <div class="grid grid-cols-4 gap-4">
      <div
        v-for="(img, index) in screenshots"
        :key="index"
        class="border rounded-lg overflow-hidden shadow-sm"
      >
        <img
          :src="buildApiAssetUrl(img.url)"
          class="w-full h-40 object-cover cursor-pointer"
          @click="$emit('preview', img.url)"
        />
      </div>
    </div>
  </div>
</template>
