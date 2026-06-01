<script setup>
import { COMMENT_ACTION, DEPLOYMENT_STATUS } from '@/constants/deploymentConstants'

defineProps({
  selected: {
    type: Object,
    required: true,
  },
  currentUser: {
    type: Object,
    default: null,
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
  'comment-action',
  'show-approval',
  'show-share',
  'update:pamInput',
  'add-pam',
  'amend',
])
</script>

<template>
  <!-- DBA Actions -->
  <div v-if="permissions.isDba && !permissions.isClosed" class="mt-8 flex flex-wrap gap-3">
    <button
      v-if="permissions.canLock"
      @click="$emit('comment-action', COMMENT_ACTION.LOCK, selected.id)"
      class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm flex gap-2 mt-3"
    >
      Lock
    </button>

    <button
      v-if="permissions.canSendForApproval"
      @click="$emit('show-approval')"
      class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm mt-3"
    >
      Send for Approval
    </button>

    <button
      v-if="permissions.canApprove"
      @click="$emit('comment-action', COMMENT_ACTION.APPROVE, selected.id)"
      class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm mt-3"
    >
      Approve Deployment
    </button>

    <!-- Rejected -->
    <button
      v-if="permissions.canReject"
      @click="$emit('comment-action', COMMENT_ACTION.REJECT, selected.id)"
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex gap-2 mt-3"
    >
      Reject
    </button>

    <button
      v-if="permissions.canRequesterReview"
      @click="$emit('comment-action', COMMENT_ACTION.REQUESTER_REVIEW, selected.id)"
      class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm flex gap-2 mt-3"
    >
      Requester Review
    </button>

    <button
      v-if="permissions.canCompleteAsDba"
      @click="$emit('comment-action', COMMENT_ACTION.COMPLETE, selected.id)"
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm flex gap-2 mt-3"
    >
      Complete
    </button>

    <!-- PAM ID -->
    <div class="flex gap-2 mt-3">
      <button
        @click="$emit('show-share')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
      >
        Select Users / Teams
      </button>

      <div v-if="sharedUsers.length || sharedTeams.length" class="mt-2 text-sm text-slate-600">
        {{ sharedUsers.length }} Users, {{ sharedTeams.length }} Teams selected
      </div>
      <!-- Share with User -->

      <input
        :value="pamInput"
        @input="$emit('update:pamInput', $event.target.value)"
        placeholder="Enter PAM ID"
        class="border px-3 py-1 rounded"
      />
      <button
        @click="$emit('add-pam')"
        class="bg-gray-500 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium transition"
      >
        Add PAM ID
      </button>
    </div>
  </div>

  <!-- Developer Actions -->
  <div v-if="permissions.isDev && !permissions.isClosed" class="flex gap-3 mt-4">
    <template v-if="selected.status === DEPLOYMENT_STATUS.REQUESTER_REVIEW">
      <button
        @click="$emit('comment-action', COMMENT_ACTION.COMPLETE, selected.id)"
        class="bg-green-600 text-white px-3 py-1 rounded"
      >
        Complete
      </button>
      <button @click="$emit('amend', selected.id)" class="bg-yellow-500 text-white px-3 py-1 rounded">
        Amend
      </button>
    </template>
    <template v-if="selected.status === DEPLOYMENT_STATUS.PENDING_APPROVAL">
      <button
        v-if="permissions.canApprove"
        @click="$emit('comment-action', COMMENT_ACTION.APPROVE, selected.id)"
        class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm mt-3"
      >
        Approve Deployment
      </button>

      <!-- Rejected -->
      <button
        v-if="permissions.canReject"
        @click="$emit('comment-action', COMMENT_ACTION.REJECT, selected.id)"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex gap-2 mt-3"
      >
        Reject
      </button>
    </template>
    <p v-else class="text-gray-500">Can amend only in Requester Review stage</p>
  </div>
</template>
