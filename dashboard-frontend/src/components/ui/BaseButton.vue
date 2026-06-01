<script setup lang="ts">
defineProps<{
  label?: string
  disabled?: boolean
  type?: "button" | "submit"
}>()

defineEmits(["click"])
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    @click="$emit('click')"
class="px-4 py-2 rounded-lg font-medium
       bg-blue-600 hover:bg-blue-500
       text-white transition duration-200"
  >
    <slot>
      {{ label }}
    </slot>
  </button>
</template>