<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="space-y-1.5">
    <label class="block text-sm font-semibold text-slate-700">
      {{ label }}<span v-if="required" class="text-rose-600"> *</span>
    </label>

    <slot />

    <p v-if="hint" class="text-xs text-slate-500">
      {{ hint }}
    </p>
  </div>
</template>
