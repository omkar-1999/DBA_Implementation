<script setup>
import { Check, X } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  teams: {
    type: Array,
    default: () => [],
  },
  modelUsers: {
    type: Array,
    default: () => [],
  },
  modelTeams: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:users', 'update:teams'])

const userSearch = ref('')
const teamSearch = ref('')
const showUserDropdown = ref(false)
const showTeamDropdown = ref(false)
const sharedUsers = ref([])
const sharedTeams = ref([])

const filteredUsers = computed(() =>
  props.users.filter((user) => user.name?.toLowerCase().includes(userSearch.value.toLowerCase())),
)

const filteredTeams = computed(() =>
  props.teams.filter((team) =>
    team.teamName?.toLowerCase().includes(teamSearch.value.toLowerCase()),
  ),
)

watch(
  () => props.modelUsers,
  (users) => {
    sharedUsers.value = [...(users || [])]
  },
  { immediate: true },
)

watch(
  () => props.modelTeams,
  (teams) => {
    sharedTeams.value = [...(teams || [])]
  },
  { immediate: true },
)

function selectUser(id) {
  if (!sharedUsers.value.includes(id)) {
    sharedUsers.value.push(id)
    emit('update:users', [...sharedUsers.value])
  }

  showUserDropdown.value = false
  userSearch.value = ''
}

function selectTeam(id) {
  if (!sharedTeams.value.includes(id)) {
    sharedTeams.value.push(id)
    emit('update:teams', [...sharedTeams.value])
  }

  showTeamDropdown.value = false
  teamSearch.value = ''
}

function removeUser(id) {
  sharedUsers.value = sharedUsers.value.filter((userId) => userId !== id)
  emit('update:users', [...sharedUsers.value])
}

function removeTeam(id) {
  sharedTeams.value = sharedTeams.value.filter((teamId) => teamId !== id)
  emit('update:teams', [...sharedTeams.value])
}

function handleClickOutside(event) {
  if (!event.target.closest('.user-box')) showUserDropdown.value = false
  if (!event.target.closest('.team-box')) showTeamDropdown.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="user-box relative">
      <label class="text-xs font-semibold text-slate-500">Users</label>

      <input
        v-model="userSearch"
        placeholder="Search users..."
        class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        @focus="showUserDropdown = true"
      />

      <div
        v-if="showUserDropdown"
        class="absolute bottom-full z-20 mb-1 max-h-44 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg"
      >
        <button
          v-for="user in filteredUsers"
          :key="user.id"
          type="button"
          class="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
          @click="selectUser(user.id)"
        >
          <span>{{ user.name }}</span>
          <Check v-if="sharedUsers.includes(user.id)" class="h-4 w-4 text-blue-600" />
        </button>
      </div>

      <div class="mt-2 flex flex-wrap gap-1">
        <span
          v-for="id in sharedUsers"
          :key="id"
          class="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700"
        >
          {{ users.find((user) => user.id === id)?.name || id }}
          <button type="button" title="Remove user" @click="removeUser(id)">
            <X class="h-3 w-3" />
          </button>
        </span>
      </div>
    </div>

    <div class="team-box relative">
      <label class="text-xs font-semibold text-slate-500">Teams</label>

      <input
        v-model="teamSearch"
        placeholder="Search teams..."
        class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        @focus="showTeamDropdown = true"
      />

      <div
        v-if="showTeamDropdown"
        class="absolute bottom-full z-20 mb-1 max-h-44 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg"
      >
        <button
          v-for="team in filteredTeams"
          :key="team.teamId"
          type="button"
          class="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
          @click="selectTeam(team.teamId)"
        >
          <span>{{ team.teamName }}</span>
          <Check v-if="sharedTeams.includes(team.teamId)" class="h-4 w-4 text-teal-600" />
        </button>
      </div>

      <div class="mt-2 flex flex-wrap gap-1">
        <span
          v-for="id in sharedTeams"
          :key="id"
          class="flex items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700"
        >
          {{ teams.find((team) => team.teamId === id)?.teamName || id }}
          <button type="button" title="Remove team" @click="removeTeam(id)">
            <X class="h-3 w-3" />
          </button>
        </span>
      </div>
    </div>
  </div>
</template>
