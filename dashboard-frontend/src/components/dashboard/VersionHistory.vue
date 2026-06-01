<script setup>
import { API_BASE_URL } from '@/constants/deploymentConstants'

defineProps({
  selected: {
    type: Object,
    required: true,
  },
  workflowActions: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['execute-action'])

function getVersionFiles(selected, version, index) {
  if (!selected || !selected.versions) return []

  if (index === 0) {
    return version.deploymentFiles || []
  }

  const previousVersion = selected.versions[index - 1]
  const previousFiles = previousVersion?.deploymentFiles || []
  const currentFiles = version.deploymentFiles || []

  return currentFiles.filter((curr) => !previousFiles.some((prev) => prev.name === curr.name))
}
</script>

<template>
  <div v-if="selected.versions && selected.versions.length" class="mt-10 border-t pt-6">
    <h3 class="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
      Version History
    </h3>

    <div
      v-for="(v, index) in selected.versions"
      :key="v.version"
      class="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-4"
    >
      <div class="flex justify-between items-center">
        <p class="font-semibold text-slate-800">Version {{ v.version }}</p>

        <span class="text-xs text-slate-400">
          {{ v.amendedAt }}
        </span>
      </div>

      <!-- Reason -->
      <p class="text-sm text-slate-600 mt-2"><strong>Reason:</strong> {{ v.reason }}</p>
      <div class="flex gap-2 mt-3">
        <button
          v-for="action in workflowActions"
          :key="action.actionName"
          class="px-3 py-1 bg-blue-600 text-white rounded"
          @click="$emit('execute-action', action)"
        >
          {{ action.actionName }}
        </button>
      </div>
      <!-- Files (Only Files Introduced In This Version) -->
      <div v-if="v.deploymentFiles && v.deploymentFiles.length" class="mt-3">
        <p class="text-xs font-semibold text-slate-500 uppercase mb-2">Files Submitted</p>

        <div
          v-for="(file, fileIndex) in getVersionFiles(selected, v, index)"
          :key="fileIndex"
          class="text-sm text-teal-600 hover:underline cursor-pointer"
          @click="
            window.open(
              `${API_BASE_URL}/api/deployments/file/${selected.code}/${file.name}`,
              '_blank',
            )
          "
        >
          {{ file.name }}
        </div>
      </div>
    </div>
  </div>
</template>
