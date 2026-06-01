<script setup>
import { DEPLOYMENT_STATUS } from '@/constants/deploymentConstants'

defineProps({
  counts: {
    type: Object,
    required: true,
  },
  hasPendingApprovals: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['select-status'])
</script>

<template>
  <div class="grid gap-6 mb-8" :class="hasPendingApprovals ? 'grid-cols-6' : 'grid-cols-5'">
    <div
      @click="$emit('select-status', '')"
      class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
    >
      <p class="text-xs text-slate-500 uppercase tracking-wide">All</p>
      <p class="text-3xl font-bold text-slate-800 mt-2">
        {{ counts.all }}
      </p>
    </div>

    <div
      @click="$emit('select-status', DEPLOYMENT_STATUS.OPEN)"
      class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
    >
      <p class="text-xs text-slate-500 uppercase tracking-wide">Open</p>
      <p class="text-3xl font-bold text-teal-600 mt-2">{{ counts.open }}</p>
    </div>

    <div
      @click="$emit('select-status', DEPLOYMENT_STATUS.IN_PROGRESS)"
      class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
    >
      <p class="text-xs text-slate-500 uppercase tracking-wide">In Progress</p>
      <p class="text-3xl font-bold text-slate-700 mt-2">{{ counts.inProgress }}</p>
    </div>

    <div
      @click="$emit('select-status', DEPLOYMENT_STATUS.REQUESTER_REVIEW)"
      class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
    >
      <p class="text-xs text-slate-500 uppercase tracking-wide">Requester Review</p>
      <p class="text-3xl font-bold text-indigo-600 mt-2">{{ counts.requesterReview }}</p>
    </div>

    <div
      @click="$emit('select-status', DEPLOYMENT_STATUS.CLOSED)"
      class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
    >
      <p class="text-xs text-slate-500 uppercase tracking-wide">Closed</p>
      <p class="text-3xl font-bold text-green-600 mt-2">{{ counts.closed }}</p>
    </div>

    <div
      v-if="hasPendingApprovals"
      @click="$emit('select-status', DEPLOYMENT_STATUS.PENDING_APPROVAL)"
      class="cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
    >
      <p class="text-xs text-slate-500 uppercase tracking-wide">Pending Approval</p>
      <p class="text-3xl font-bold text-green-600 mt-2">{{ counts.pendingApproval }}</p>
    </div>
  </div>
</template>
