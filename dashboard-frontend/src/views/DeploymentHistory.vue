<script setup>
import { ref, computed } from 'vue'
import { useDeploymentStore } from '@/stores/deploymentStore.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const { deployments } = useDeploymentStore()

const selected = ref(null)
const selectedDatabase = ref('')
const developerFilter = ref('')
const fromDate = ref('')
const toDate = ref('')

/* Only Closed Deployments */
const historyDeployments = computed(() => {
  return deployments
    .filter(d => d.status === 'Closed')
    .filter(d => {
      const dbMatch = selectedDatabase.value
        ? d.database === selectedDatabase.value
        : true

      const devMatch = developerFilter.value
        ? d.requestedBy.toLowerCase()
            .includes(developerFilter.value.toLowerCase())
        : true

      const dateMatch =
        (!fromDate.value || d.date >= fromDate.value) &&
        (!toDate.value || d.date <= toDate.value)

      return dbMatch && devMatch && dateMatch
    })
})

/* Extract Closed Date from Audit */
function getClosedDate(deployment) {
  const closedLog = deployment.auditTrail?.find(log =>
    log.action.includes('Closed')
  )
  return closedLog?.at || 'N/A'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">

    <!-- Header -->
    <div class="mb-8 flex justify-between items-center">
      <h1 class="text-3xl font-bold">
        Deployment History
      </h1>

      <button
        @click="router.push('/')"
        class="bg-gray-600 text-white px-4 py-2 rounded">
        ← Back to Dashboard
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded shadow mb-6 flex gap-4 flex-wrap">

      <select v-model="selectedDatabase"
              class="border px-3 py-2 rounded">
        <option value="">All Databases</option>
        <option>Shipwatch</option>
        <option>Engine</option>
        <option>BAO</option>
      </select>

      <input v-model="developerFilter"
             placeholder="Filter by Developer"
             class="border px-3 py-2 rounded" />

      <input type="date"
             v-model="fromDate"
             class="border px-3 py-2 rounded" />

      <input type="date"
             v-model="toDate"
             class="border px-3 py-2 rounded" />

    </div>

    <!-- Table -->
    <div class="bg-white shadow rounded">
      <table class="w-full text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3">ID</th>
            <th class="p-3">Database</th>
            <th class="p-3">Requested By</th>
            <th class="p-3">Requested Date</th>
            <th class="p-3">Closed Date</th>
            <th class="p-3">PAM ID</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="deployment in historyDeployments"
              :key="deployment.id"
              @click="selected = deployment"
              class="cursor-pointer hover:bg-gray-50">

            <td class="p-3 font-medium">{{ deployment.id }}</td>
            <td class="p-3">{{ deployment.database }}</td>
            <td class="p-3">{{ deployment.requestedBy }}</td>
            <td class="p-3">{{ deployment.date }}</td>
            <td class="p-3">
              {{ getClosedDate(deployment) }}
            </td>
            <td class="p-3">
              {{ deployment.pamId || '—' }}
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <div v-if="selected"
         class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div class="bg-white w-2/3 p-6 rounded shadow-lg">

        <div class="flex justify-between mb-4">
          <h2 class="text-xl font-bold">
            {{ selected.id }} - Full Audit
          </h2>
          <button @click="selected=null"
                  class="text-red-500 font-bold">X</button>
        </div>

        <p><strong>Database:</strong> {{ selected.database }}</p>
        <p><strong>Requested By:</strong> {{ selected.requestedBy }}</p>
        <p><strong>Reason:</strong> {{ selected.reason }}</p>
        <p><strong>PAM ID:</strong> {{ selected.pamId || 'N/A' }}</p>

        <div class="mt-6">
          <h3 class="font-semibold mb-2">Audit Trail</h3>

          <div v-for="(log, index) in selected.auditTrail"
               :key="index"
               class="bg-gray-100 p-3 rounded mb-2 flex justify-between text-sm">
            <span>{{ log.action }} by <strong>{{ log.by }}</strong></span>
            <span class="text-gray-500">{{ log.at }}</span>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>