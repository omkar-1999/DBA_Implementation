<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
})

defineEmits(['close'])
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
    <!-- CLOSE BUTTON -->
    <button
      @click="$emit('close')"
      class="absolute top-5 right-5 text-slate-700 hover:text-black text-3xl"
    >
      ✕
    </button>

    <!-- IMAGE CONTAINER -->
    <div class="bg-white rounded-2xl p-4 shadow-2xl max-w-[95vw] max-h-[95vh] overflow-auto">
      <img :src="image" class="max-h-[85vh] max-w-[85vw] rounded-lg object-contain" />
    </div>
  </div>
</template>
