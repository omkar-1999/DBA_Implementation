<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
  type?: string
}>()

const emit = defineEmits(["update:modelValue"])
</script>

<template>
  <input
    :type="type || 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
class="w-full px-4 py-2 rounded-lg
       bg-white border border-gray-300
       text-gray-800 placeholder:text-gray-400
       focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</template>