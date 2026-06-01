<script setup>
import azureIcon from '@/assets/Azure-DevOps-Logo.jpg'
import { Copy } from 'lucide-vue-next'
import { buildApiAssetUrl, isAzureLink, openExternalLink } from '@/utils/urlUtils'

defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  expandedAudit: {
    type: [Number, null],
    default: null,
  },
  expandedData: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits([
  'view-details',
  'view-amend-details',
  'collapse',
  'download',
  'preview',
  'copy-sql',
])
</script>

<template>
  <!-- Audit -->
  <div class="mt-10 border-t pt-6">
    <h3 class="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Audit Trail</h3>

    <div
      v-for="(log, index) in comments"
      :key="index"
      class="bg-slate-50 border border-slate-200 p-4 rounded-lg mb-3 text-sm"
    >
      <!-- HEADER -->
      <div class="flex justify-between">
        <span class="text-slate-700">
          {{ log.activityType }}
          <template v-if="log.commentText"> - {{ log.commentText }} </template>
          by <strong>{{ log.userName }}</strong>
        </span>

        <span class="text-slate-400">
          {{ log.activityTime }}
        </span>
      </div>

      <!-- ✅ REMARKS -->
      <div v-if="log.Remarks" class="mt-4">
        <strong class="text-sm text-slate-700">Remarks:</strong>

        <div class="whitespace-pre-wrap">
          {{ log.Remarks }}
        </div>
      </div>

      <!-- ✅ ATTACHMENTS -->
      <div v-if="log.attachments && log.attachments?.length" class="mt-2">
        <p class="text-s font-semibold text-slate-500">Attachments:</p>

        <div
          v-for="(file, i) in log.attachments"
          :key="i"
          class="text-s text-teal-600 cursor-pointer hover:underline"
          @click="$emit('download', file)"
        >
          📎 {{ file.name }}
        </div>
      </div>

      <!-- ORIGINAL DEPLOYMENT -->
      <div
        v-if="
          log.activityType?.includes('Deployment Created') ||
          log.activityType?.includes('Deployment Submitted')
        "
        class="mt-3"
      >
        <button
          @click="$emit('view-details', log, index)"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-xs"
        >
          View Details
        </button>
      </div>

      <!-- AMENDMENTS -->
      <div v-if="log.activityType?.includes('Deployment Amended')" class="mt-3">
        <button
          @click="$emit('view-amend-details', log, index)"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-xs"
        >
          View Amend Details
        </button>
      </div>

      <!-- Amend Details Modal -->
      <!-- Expandable Details -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[5000px]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-[5000px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="expandedAudit === index" class="mt-5 overflow-hidden">
          <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <!-- COLLAPSE -->
            <div class="flex justify-end mb-4">
              <button @click="$emit('collapse')" class="text-sm text-slate-500 hover:text-black">
                Collapse
              </button>
            </div>

            <!-- TITLE -->
            <h2 class="text-2xl font-semibold mb-8">
              {{
                expandedData[index]?.details?.version_number == 1
                  ? 'Deployment Details'
                  : `Amend Deployment Details - v${expandedData[index]?.details?.version_number}`
              }}
            </h2>

            <!-- INFO GRID -->
            <div class="grid grid-cols-2 gap-6 text-sm text-slate-700">
              <div v-if="expandedData[index]?.details?.database_name">
                <strong>Database:</strong>
                {{ expandedData[index]?.details?.database_name }}
              </div>

              <div v-if="expandedData[index]?.details?.display_name">
                <strong>Requested By:</strong>
                {{ expandedData[index]?.details?.display_name }}
              </div>

              <div v-if="expandedData[index]?.details?.reason">
                <strong>Reason:</strong>
                {{ expandedData[index]?.details?.reason }}
              </div>

              <!-- Remarks -->
              <div v-if="expandedData[index]?.details?.remarks" class="col-span-2">
                <strong>Remarks:</strong>

                <div class="whitespace-pre-wrap">
                  {{ expandedData[index]?.details?.remarks }}
                </div>
              </div>

              <!-- Deployment URL -->
              <div v-if="expandedData[index]?.details?.deploymentUrl">
                <strong>Deployment URL:</strong>

                <div class="flex items-center gap-2 mt-1">
                  <img
                    v-if="isAzureLink(expandedData[index]?.details?.deploymentUrl)"
                    :src="azureIcon"
                    class="w-5 h-5"
                  />

                  <span
                    @click="openExternalLink(expandedData[index]?.details?.deploymentUrl)"
                    class="text-blue-600 hover:underline cursor-pointer break-all"
                  >
                    {{ expandedData[index]?.details?.deploymentUrl }}
                  </span>
                </div>
              </div>

              <!-- Pull Request -->
              <div v-if="expandedData[index]?.details?.prNumber">
                <strong>Pull Request:</strong>

                <div class="flex items-center gap-2 mt-1">
                  <img
                    v-if="isAzureLink(expandedData[index]?.details?.prNumber)"
                    :src="azureIcon"
                    class="w-5 h-5"
                  />

                  <span
                    @click="openExternalLink(expandedData[index]?.details?.prNumber)"
                    class="text-blue-600 hover:underline cursor-pointer break-all"
                  >
                    {{ expandedData[index]?.details?.prNumber }}
                  </span>
                </div>
              </div>

              <!-- Change Request -->
              <div v-if="expandedData[index]?.details?.changeRequest" class="col-span-2">
                <strong>Change Request:</strong>
                {{ expandedData[index]?.details?.changeRequest }}
              </div>
            </div>

            <!-- DEPLOYMENT FILES -->
            <div v-if="expandedData[index]?.files?.length" class="mt-10 border-t pt-6">
              <h3 class="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                Deployment Files
              </h3>

              <div
                v-for="(file, fileIndex) in expandedData[index]?.files"
                :key="fileIndex"
                class="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-lg mb-3"
              >
                <p class="text-sm font-medium text-slate-800">
                  {{ file.name }}
                </p>

                <button
                  @click="$emit('download', file)"
                  class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Download
                </button>
              </div>
            </div>

            <!-- SQL SCRIPT -->
            <div v-if="expandedData[index]?.details?.sqlScript" class="mt-10 border-t pt-6">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  SQL Script
                </h3>

                <button
                  @click="$emit('copy-sql', expandedData[index]?.details?.sqlScript)"
                  class="p-2 rounded-md hover:bg-slate-200 transition"
                  title="Copy SQL Script"
                >
                  <Copy class="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div class="bg-white border border-slate-300 rounded-lg overflow-auto max-h-[300px]">
                <pre
                  class="p-4 text-slate-800 leading-6 whitespace-pre-wrap min-w-max font-mono text-[13px]"
                ><code>{{ expandedData[index]?.details?.sqlScript }}</code></pre>
              </div>
            </div>

            <!-- SCREENSHOTS -->
            <div v-if="expandedData[index]?.screenshots?.length" class="mt-10 border-t pt-6">
              <h3 class="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                Screenshots
              </h3>

              <div class="grid grid-cols-4 gap-4">
                <div
                  v-for="(img, imgIndex) in expandedData[index]?.screenshots"
                  :key="imgIndex"
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
          </div>
        </div>
      </transition>

      <!-- ✅ SCREENSHOTS -->
      <div v-if="log.screenshots && log.screenshots?.length" class="mt-3">
        <p class="text-s font-semibold text-slate-500 mb-1">Screenshots:</p>

        <div class="flex gap-2 flex-wrap">
          <img
            v-for="(img, i) in log.screenshots"
            :key="i"
            :src="buildApiAssetUrl(img.url)"
            class="w-24 h-20 object-cover rounded border cursor-pointer"
            @click="$emit('preview', img.url)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
