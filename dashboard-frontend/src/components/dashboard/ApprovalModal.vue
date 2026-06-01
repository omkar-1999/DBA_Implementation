<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  approvers: {
    type: Array,
    default: () => [],
  },
  selectedApprovers: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['close', 'send', 'update:selectedApprovers'])
</script>

<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm z-40 flex items-center justify-center">
    <div class="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-lg relative">
      <!-- CLOSE -->
      <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-500">✕</button>

      <h2 class="text-lg font-semibold mb-4">Select Approvers</h2>

      <!-- Multi Select -->
      <div class="space-y-2 max-h-60 overflow-auto">
        <div v-for="user in approvers" :key="user.userId" class="flex items-center gap-2">
          <input
            type="checkbox"
            :value="user.userId"
            :checked="selectedApprovers.includes(user.userId)"
            @change="
              $emit(
                'update:selectedApprovers',
                $event.target.checked
                  ? [...selectedApprovers, user.userId]
                  : selectedApprovers.filter((id) => id !== user.userId),
              )
            "
          />
          <span>{{ user.displayName }}</span>
        </div>
      </div>

      <!-- ACTION -->
      <div class="flex justify-end mt-4">
        <button @click="$emit('send')" class="bg-purple-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  </div>
</template>
