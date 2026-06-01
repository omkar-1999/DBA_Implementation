import { reactive, ref } from 'vue'
import { auditService } from '@/services/auditService'
import { fileService } from '@/services/fileService'
import { handleError } from '@/utils/errorHandler'

export function useDeploymentDetails(store, selected, sharedUsers, sharedTeams) {
  const deploymentFiles = ref([])
  const screenshots = ref([])
  const expandedAudit = ref(null)
  const expandedData = ref({})
  const loading = reactive({
    deployments: false,
    files: false,
    audit: false,
    version: false,
  })

  const loadSelectedAssets = async (deployment) => {
    if (!deployment) return

    loading.files = true

    try {
      sharedUsers.value = deployment.sharedUsersIds || []
      sharedTeams.value = deployment.sharedTeamsIds || []

      const rawAudit = await auditService.getRawAuditComments(deployment.id)
      const latestLog = rawAudit?.[0]
      const version = latestLog?.version_number || 1

      const [files, loadedScreenshots] = await Promise.all([
        fileService.getFiles(deployment.code, version),
        fileService.getScreenshots(deployment.code, version),
      ])

      deploymentFiles.value = files
      screenshots.value = loadedScreenshots
    } catch (error) {
      handleError(error, 'Error loading deployment files')
      deploymentFiles.value = []
      screenshots.value = []
    } finally {
      loading.files = false
    }
  }

  const loadSelectedAudit = async (deployment) => {
    if (!deployment) return

    loading.audit = true

    try {
      sharedUsers.value = deployment.sharedUsersIds || []
      sharedTeams.value = deployment.sharedTeamsIds || []
      await store.fetchDeploymentAuditsComments(
        deployment.id,
        deployment.code,
        deployment.version_number,
      )
    } finally {
      loading.audit = false
    }
  }

  const refreshAllData = async () => {
    const selectedId = selected.value?.id

    loading.deployments = true

    try {
      await store.fetchDeployments()

      if (selectedId) {
        const updated = store.deployments.find((deployment) => deployment.id === selectedId)
        selected.value = updated || null
      }

      if (selected.value) {
        await Promise.all([loadSelectedAudit(selected.value), loadSelectedAssets(selected.value)])
      }
    } finally {
      loading.deployments = false
    }
  }

  const loadVersionDetails = async (log, index, fallbackVersion) => {
    if (!selected.value) return

    if (expandedAudit.value === index) {
      expandedAudit.value = null
      return
    }

    loading.version = true
    expandedAudit.value = index

    try {
      const version = log.version_number || fallbackVersion || 1
      const versionFolder = `${selected.value.code}/v${version}`

      const [details, files, loadedScreenshots] = await Promise.all([
        auditService.getVersionDetails(selected.value.id, version),
        fileService.getFilesByFolder(versionFolder),
        fileService.getScreenshotsByFolder(versionFolder),
      ])

      expandedData.value[index] = {
        details,
        files,
        screenshots: loadedScreenshots,
      }
    } catch (error) {
      handleError(error, 'Error loading version details')
    } finally {
      loading.version = false
    }
  }

  return {
    deploymentFiles,
    screenshots,
    expandedAudit,
    expandedData,
    loading,
    loadSelectedAssets,
    loadSelectedAudit,
    refreshAllData,
    loadVersionDetails,
  }
}
