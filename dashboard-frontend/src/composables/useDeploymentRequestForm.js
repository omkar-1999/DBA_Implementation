import { computed, ref } from 'vue'
import {
  getDeploymentById,
  getDeploymentFiles,
  getDeploymentScreenshots,
  getInitialDeploymentData,
} from '@/services/deploymentService'

const STORAGE_KEYS = {
  users: 'sharedUsers',
  teams: 'sharedTeams',
}

function createInitialFormData() {
  return {
    database: '',
    databaseName: '',
    customDatabaseName: '',
    deploymentUrl: '',
    requestedBy: '',
    reason: '',
    changeRequest: '',
    prNumber: '',
    prApprovalUrl: '',
    status: 'Open',
    SqlScript: '',
    Remarks: '',
    screenshots: [],
    scheduleAt: null,
    deploymentFiles: [],
  }
}

function readStoredArray(key) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useDeploymentRequestForm() {
  const formData = ref(createInitialFormData())
  const databases = ref([])
  const availableUsers = ref([])
  const availableTeams = ref([])
  const sharedUsers = ref([])
  const sharedTeams = ref([])
  const loading = ref(false)
  const loadError = ref('')

  const apiBaseUrl = computed(() => import.meta.env.VITE_API_BASE_URL || '')
  const hasShareSelection = computed(
    () => sharedUsers.value.length > 0 || sharedTeams.value.length > 0,
  )
  const isReadyToSubmit = computed(() =>
    Boolean(formData.value.database && formData.value.reason.trim()),
  )

  async function initialize({ deploymentId } = {}) {
    loading.value = true
    loadError.value = ''

    try {
      sharedUsers.value = readStoredArray(STORAGE_KEYS.users)
      sharedTeams.value = readStoredArray(STORAGE_KEYS.teams)

      const data = await getInitialDeploymentData()
      databases.value = data.databases || []
      availableUsers.value = data.users || []
      availableTeams.value = data.teams || []

      if (deploymentId) {
        await loadAmendDeployment(deploymentId)
      }
    } catch (error) {
      loadError.value = 'Unable to load deployment form data.'
      throw error
    } finally {
      loading.value = false
    }
  }

  async function loadAmendDeployment(deploymentId) {
    const existing = await getDeploymentById(deploymentId)

    if (!existing) return

    const [files, screenshots] = await Promise.all([
      getDeploymentFiles(existing.deployment_code, existing.version_number),
      getDeploymentScreenshots(existing.deployment_code, existing.version_number),
    ])

    Object.assign(formData.value, {
      database: existing.database_id || '',
      databaseName: existing.database_name || '',
      deploymentUrl: existing.deployment_url || '',
      requestedBy: existing.requested_by || '',
      reason: existing.reason || '',
      changeRequest: existing.change_request || '',
      prNumber: existing.pr_number || '',
      prApprovalUrl: existing.pr_approval_url || '',
      status: existing.status_name || 'Open',
      SqlScript: existing.sqlScript || '',
      Remarks: existing.remarks || '',
      screenshots: screenshots || [],
      deploymentFiles: files || [],
      scheduleAt: null,
    })

    sharedUsers.value = existing.sharedUsers || []
    sharedTeams.value = existing.sharedTeams || []
  }

  function clearAmendData() {
    Object.assign(formData.value, {
      SqlScript: '',
      Remarks: '',
      screenshots: [],
      deploymentFiles: [],
      reason: '',
      changeRequest: '',
      prNumber: '',
      prApprovalUrl: '',
      deploymentUrl: '',
    })

    sharedUsers.value = []
    sharedTeams.value = []
  }

  function selectDatabase(selectedName) {
    const selectedDb = databases.value.find((db) => db.database_name === selectedName)

    if (selectedDb) {
      formData.value.database = selectedDb.database_id
      formData.value.databaseName = selectedDb.database_name
      return
    }

    formData.value.database = ''
    formData.value.databaseName = selectedName
  }

  function addDeploymentFiles(event) {
    const selectedFiles = Array.from(event.target.files || [])
    formData.value.deploymentFiles.push(...selectedFiles)
    event.target.value = ''
  }

  function removeDeploymentFile(index) {
    formData.value.deploymentFiles.splice(index, 1)
  }

  function addPastedScreenshots(event) {
    const items = Array.from(event.clipboardData?.items || [])

    for (const item of items) {
      if (item.type.includes('image')) {
        const file = item.getAsFile()
        if (file) formData.value.screenshots.push(file)
      }
    }
  }

  function removeScreenshot(index) {
    formData.value.screenshots.splice(index, 1)
  }

  function setSharedUsers(users) {
    sharedUsers.value = users
  }

  function setSharedTeams(teams) {
    sharedTeams.value = teams
  }

  function getUserName(userId) {
    return availableUsers.value.find((user) => user.id === userId)?.name || userId
  }

  function getTeamName(teamId) {
    return availableTeams.value.find((team) => team.teamId === teamId)?.teamName || teamId
  }

  function buildSubmissionPayload({ deploymentId } = {}) {
    return {
      ...formData.value,
      id: deploymentId,
      database: formData.value.database,
      deploymentFiles: formData.value.deploymentFiles || [],
      screenshots: formData.value.screenshots || [],
      sharedUsers: sharedUsers.value,
      sharedTeams: sharedTeams.value,
      SqlScript: formData.value.SqlScript,
      Remarks: formData.value.Remarks?.replace(/\r\n/g, '\n'),
      scheduleAt: formData.value.scheduleAt || null,
      date: new Date().toISOString().split('T')[0],
    }
  }

  return {
    formData,
    databases,
    availableUsers,
    availableTeams,
    sharedUsers,
    sharedTeams,
    loading,
    loadError,
    apiBaseUrl,
    hasShareSelection,
    isReadyToSubmit,
    initialize,
    clearAmendData,
    selectDatabase,
    addDeploymentFiles,
    removeDeploymentFile,
    addPastedScreenshots,
    removeScreenshot,
    setSharedUsers,
    setSharedTeams,
    getUserName,
    getTeamName,
    buildSubmissionPayload,
  }
}
