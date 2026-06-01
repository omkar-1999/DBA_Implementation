<script setup>
defineProps({
  deployments: {
    type: Array,
    required: true,
  },
})

defineEmits(['select-deployment'])
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="px-6 py-4 border-b bg-slate-800">
      <h2 class="text-sm font-semibold text-white uppercase tracking-wide">Deployment Requests</h2>
    </div>

    <table class="w-full text-sm">
      <thead class="bg-slate-100 text-slate-600 uppercase text-xs">
        <tr>
          <th class="px-6 py-3 text-left">ID</th>
          <th class="px-6 py-3 text-left">Database</th>
          <th class="px-6 py-3 text-left">Requested By</th>
          <th class="px-6 py-3 text-left">Date</th>
          <th class="px-6 py-3 text-left">Reason</th>
          <th class="px-6 py-3 text-left">Status</th>
        </tr>
      </thead>

      <tbody class="divide-y divide-slate-200">
        <tr
          v-for="deployment in deployments"
          :key="deployment.id"
          @click="$emit('select-deployment', deployment)"
          class="hover:bg-teal-50 cursor-pointer transition"
        >
          <td class="px-6 py-4 font-semibold text-slate-800">
            {{ deployment.code }}
          </td>

          <td class="px-6 py-4 text-slate-700">
            {{ deployment.database }}
          </td>

          <td class="px-6 py-4 text-slate-600">
            {{ deployment.requestedBy }}
          </td>

          <td class="px-6 py-4 text-slate-500">
            {{ deployment.date }}
          </td>

          <td class="px-6 py-4 text-slate-500 truncate max-w-xs">
            {{ deployment.reason }}
          </td>
          <td class="px-6 py-4 text-slate-500">
            {{ deployment.status }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
