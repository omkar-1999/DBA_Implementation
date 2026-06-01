<script setup>
import ShareDeployment from '@/components/ShareDeployment.vue'

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  users: {
    type: Array,
    default: () => [],
  },
  teams: {
    type: Array,
    default: () => [],
  },
  sharedUsers: {
    type: Array,
    default: () => [],
  },
  sharedTeams: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['close', 'save', 'update:users', 'update:teams'])
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 backdrop-blur-sm z-40 bg-opacity-40 flex items-center justify-center"
  >
    <div class="bg-white w-full max-w-2xl rounded-xl p-6 shadow-lg relative">
      <!-- CLOSE -->
      <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-500">✕</button>

      <h2 class="text-lg font-semibold mb-4">Share Deployment</h2>

      <!-- SAME COMPONENT -->
      <ShareDeployment
        :users="users"
        :teams="teams"
        :modelUsers="sharedUsers"
        :modelTeams="sharedTeams"
        @update:users="$emit('update:users', $event)"
        @update:teams="$emit('update:teams', $event)"
      />

      <!-- DONE BUTTON -->
      <div class="flex justify-end mt-4">
        <button @click="$emit('save')" class="bg-slate-800 text-white px-4 py-2 rounded">
          Done
        </button>
      </div>
    </div>
  </div>
</template>
