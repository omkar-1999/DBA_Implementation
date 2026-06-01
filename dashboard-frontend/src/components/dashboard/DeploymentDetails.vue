<script setup>
import azureIcon from '@/assets/Azure-DevOps-Logo.jpg'
import { Copy } from 'lucide-vue-next'
import { DEPLOYMENT_STATUS } from '@/constants/deploymentConstants'
import { isAzureLink, openExternalLink } from '@/utils/urlUtils'
import VersionHistory from '@/components/dashboard/VersionHistory.vue'
import DeploymentScreenshots from '@/components/dashboard/DeploymentScreenshots.vue'
import DeploymentFiles from '@/components/dashboard/DeploymentFiles.vue'
import SQLViewer from '@/components/dashboard/SQLViewer.vue'
import DeploymentActions from '@/components/dashboard/DeploymentActions.vue'
import DeploymentAudit from '@/components/dashboard/DeploymentAudit.vue'

defineProps({
  selected: {
    type: Object,
    required: true,
  },
  currentUser: {
    type: Object,
    default: null,
  },
  workflowActions: {
    type: Array,
    default: () => [],
  },
  screenshots: {
    type: Array,
    default: () => [],
  },
  deploymentFiles: {
    type: Array,
    default: () => [],
  },
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
  permissions: {
    type: Object,
    required: true,
  },
  sharedUsers: {
    type: Array,
    default: () => [],
  },
  sharedTeams: {
    type: Array,
    default: () => [],
  },
  pamInput: {
    type: String,
    default: '',
  },
})

defineEmits([
  'copy-details',
  'execute-action',
  'preview',
  'download',
  'copy-sql',
  'comment-action',
  'show-approval',
  'show-share',
  'update:pamInput',
  'add-pam',
  'amend',
  'view-details',
  'view-amend-details',
  'collapse-audit',
])
</script>

<template>
  <div class="mt-10 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
    <div class="flex justify-between items-center mb-6">
      <!-- LEFT: Code + Status -->
      <div class="flex items-center gap-3">
        <!-- Deployment Code -->
        <span class="text-xl font-semibold text-slate-800"> Deployment #{{ selected.code }} </span>

        <!-- Status (same size & aligned) -->
        <span
          class="px-3 py-1 text-sm rounded-md font-medium"
          :class="{
            'bg-teal-100 text-teal-700': selected.status === DEPLOYMENT_STATUS.OPEN,
            'bg-slate-200 text-slate-700': selected.status === DEPLOYMENT_STATUS.IN_PROGRESS,
            'bg-indigo-100 text-indigo-700': selected.status === DEPLOYMENT_STATUS.REQUESTER_REVIEW,
            'bg-green-100 text-green-700': selected.status === DEPLOYMENT_STATUS.CLOSED,
            'bg-red-100 text-red-700': selected.status === DEPLOYMENT_STATUS.REJECTED,
            'bg-yellow-100 text-yellow-700': selected.status === DEPLOYMENT_STATUS.PENDING_APPROVAL,
            'bg-blue-100 text-blue-700': selected.status === DEPLOYMENT_STATUS.APPROVED,
          }"
        >
          {{ selected.status }}
        </span>
      </div>
      <button
        @click="$emit('copy-details')"
        class="p-2 rounded-md hover:bg-slate-200 transition"
        title="Copy Details"
      >
        <Copy class="w-7 h-7 text-slate-600" />
      </button>
    </div>

    <!-- RIGHT COPY BUTTON -->

    <VersionHistory
      :selected="selected"
      :workflow-actions="workflowActions"
      @execute-action="$emit('execute-action', $event)"
    />

    <!-- Info main Grid -->
    <div class="grid grid-cols-2 gap-6 text-sm text-slate-700">
      <div><strong>Database:</strong> {{ selected.database }}</div>
      <div><strong>Requested By:</strong> {{ selected.requestedBy }}</div>

      <div
        v-if="
          selected.scheduleAt &&
          selected.scheduleAt !== 'null' &&
          !isNaN(new Date(selected.scheduleAt))
        "
      >
        <strong>Scheduled At: </strong>

        {{
          new Date(selected.scheduleAt).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        }}
      </div>

      <div class="flex items-center gap-2 mt-1">
        <strong>Reason:</strong>

        <div class="mt-1 whitespace-pre-wrap">
          {{ selected.reason }}
        </div>
      </div>

      <div v-if="selected.Remarks" class="cflex items-center gap-2 mt-1">
        <strong>Remarks: </strong>

        <div class="whitespace-pre-wrap inline">
          {{ selected.Remarks }}
        </div>
      </div>
      <!-- Deployment URL -->
      <div v-if="selected.deploymentUrl">
        <strong>Deployment URL:</strong>

        <div class="flex items-center gap-2 mt-1">
          <img v-if="isAzureLink(selected.deploymentUrl)" :src="azureIcon" class="w-6 h-6" />

          <span
            @click="openExternalLink(selected.deploymentUrl)"
            class="text-blue-600 hover:underline cursor-pointer break-all"
          >
            {{ selected.deploymentUrl }}
          </span>
        </div>
      </div>

      <!-- Change Request -->
      <div v-if="selected.changeRequest">
        <strong>Change Request:</strong>
        {{ selected.changeRequest }}
      </div>

      <!-- Pull Request -->
      <div v-if="selected.prNumber">
        <strong>Pull Request:</strong>

        <div class="flex items-center gap-2 mt-1">
          <img v-if="isAzureLink(selected.prNumber)" :src="azureIcon" class="w-6 h-6" />

          <span
            @click="openExternalLink(selected.prNumber)"
            class="text-blue-600 hover:underline cursor-pointer break-all"
          >
            {{ selected.prNumber }}
          </span>
        </div>
      </div>

      <!-- Shared Users -->
      <div v-if="selected.sharedUsers && selected.sharedUsers.length">
        <strong>Shared Users:</strong>

        <div class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="(user, index) in selected.sharedUsers"
            :key="index"
            class="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs"
          >
            {{ user }}
          </span>
        </div>
      </div>

      <!-- Shared Teams -->
      <div v-if="selected.sharedTeams && selected.sharedTeams.length">
        <strong>Shared Teams:</strong>

        <div class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="(team, index) in selected.sharedTeams"
            :key="index"
            class="bg-teal-100 text-teal-700 px-3 py-1 rounded text-xs"
          >
            {{ team }}
          </span>
        </div>
      </div>

      <!-- PAM IDs -->
      <div v-if="selected?.pam_ids && selected.pam_ids.length > 0">
        <strong>PAM IDs:</strong>

        <div class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="(pam, index) in selected.pam_ids.split(',')"
            :key="index"
            class="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs"
          >
            {{ pam.trim() }}
          </span>
        </div>
      </div>
    </div>
    <!-- Attachments -->

    <DeploymentScreenshots :screenshots="screenshots" @preview="$emit('preview', $event)" />
    <DeploymentFiles :files="deploymentFiles" @download="$emit('download', $event)" />
    <SQLViewer :script="selected.SqlScript" @copy="$emit('copy-sql', $event)" />

    <DeploymentActions
      :selected="selected"
      :current-user="currentUser"
      :permissions="permissions"
      :shared-users="sharedUsers"
      :shared-teams="sharedTeams"
      :pam-input="pamInput"
      @comment-action="(...args) => $emit('comment-action', ...args)"
      @show-approval="$emit('show-approval')"
      @show-share="$emit('show-share')"
      @update:pam-input="$emit('update:pamInput', $event)"
      @add-pam="$emit('add-pam')"
      @amend="$emit('amend', $event)"
    />

    <DeploymentAudit
      :comments="comments"
      :expanded-audit="expandedAudit"
      :expanded-data="expandedData"
      @view-details="(...args) => $emit('view-details', ...args)"
      @view-amend-details="(...args) => $emit('view-amend-details', ...args)"
      @collapse="$emit('collapse-audit')"
      @download="$emit('download', $event)"
      @preview="$emit('preview', $event)"
      @copy-sql="$emit('copy-sql', $event)"
    />
  </div>
</template>
