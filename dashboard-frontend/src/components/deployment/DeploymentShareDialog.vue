<script setup>
import { X } from 'lucide-vue-next'
import ShareDeployment from '@/components/ShareDeployment.vue'

defineProps({
  open: {
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
  selectedUsers: {
    type: Array,
    default: () => [],
  },
  selectedTeams: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'update:users', 'update:teams'])
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
  >
    <div class="w-full max-w-2xl rounded-lg bg-white shadow-xl">
      <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 class="text-base font-semibold text-slate-900">Share Deployment</h2>
          <p class="text-sm text-slate-500">
            Choose the people and teams who should track this request.
          </p>
        </div>

        <button
          type="button"
          @click="emit('close')"
          class="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          title="Close"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="px-5 py-5">
        <ShareDeployment
          :users="users"
          :teams="teams"
          :modelUsers="selectedUsers"
          :modelTeams="selectedTeams"
          @update:users="(value) => emit('update:users', value)"
          @update:teams="(value) => emit('update:teams', value)"
        />
      </div>

      <div class="flex justify-end border-t border-slate-200 px-5 py-4">
        <button
          type="button"
          @click="emit('close')"
          class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>
