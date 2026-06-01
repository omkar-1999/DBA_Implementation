<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ShareDeployment from '@/components/ShareDeployment.vue'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const availableUsers = ref([])
const availableTeams = ref([])

const sharedUsers = ref([])
const sharedTeams = ref([])

onMounted(async () => {
const [usersResponse, teamsResponse] = await Promise.all([
  api.get('/users'),
  api.get('/teams'),
])

availableUsers.value = usersResponse.data
availableTeams.value = teamsResponse.data

  sharedUsers.value = JSON.parse(route.query.users || '[]')
  sharedTeams.value = JSON.parse(route.query.teams || '[]')
})

function saveAndClose() {
  localStorage.setItem('sharedUsers', JSON.stringify(sharedUsers.value))
  localStorage.setItem('sharedTeams', JSON.stringify(sharedTeams.value))
  router.push('/')
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-xl font-semibold mb-4">Share Deployment</h1>

    <ShareDeployment
      :users="availableUsers"
      :teams="availableTeams"
      :modelUsers="sharedUsers"
      :modelTeams="sharedTeams"
      @update:users="(val) => (sharedUsers = val)"
      @update:teams="(val) => (sharedTeams = val)"
    />

    <button @click="saveAndClose" class="mt-4 bg-slate-800 text-white px-4 py-2 rounded">
      Save
    </button>
  </div>
</template>
