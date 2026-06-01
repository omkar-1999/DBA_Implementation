<script setup>
import { Copy } from 'lucide-vue-next'

defineProps({
  script: {
    type: String,
    default: '',
  },
})

defineEmits(['copy'])
</script>

<template>
  <div v-if="script" class="mt-10 border-t pt-6">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide">SQL Script</h3>

      <button
        @click="$emit('copy', script)"
        class="p-2 rounded-md hover:bg-slate-200 transition"
        title="Copy SQL Script"
      >
        <Copy class="w-5 h-5 text-slate-600" />
      </button>
    </div>

    <div class="bg-white border border-slate-300 rounded-lg overflow-auto max-h-[300px]">
      <pre
        class="p-4 text-slate-800 leading-6 whitespace-pre-wrap min-w-max font-mono text-[13px]"
      ><code>{{ script }}</code></pre>
    </div>
  </div>
</template>
