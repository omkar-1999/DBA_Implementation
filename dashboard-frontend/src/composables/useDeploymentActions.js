import { ref } from 'vue'
import { deploymentService } from '@/services/deploymentService'
import { shareService } from '@/services/shareService'
import { handleError } from '@/utils/errorHandler'

export function useDeploymentActions(store, selected, currentUser, sharedUsers, sharedTeams, refreshAllData) {
  const showShareModal = ref(false)
  const pamInput = ref('')
  const actionLoading = ref(false)

  const selectDeployment = (deployment) => {
    selected.value = selected.value?.id === deployment.id ? null : deployment
  }

  const saveSharing = async () => {
    try {
      if (!selected.value) return

      await Promise.all([
        ...sharedUsers.value.map((userId) =>
          shareService.shareWithUser({
            deployment_id: selected.value.id,
            user_id: userId,
            shared_by: currentUser.value.userId,
          }),
        ),
        ...sharedTeams.value.map((teamId) =>
          shareService.shareWithTeam({
            deployment_id: selected.value.id,
            team_id: teamId,
            shared_by: currentUser.value.userId,
          }),
        ),
      ])

      await refreshAllData()

      showShareModal.value = false
    } catch (error) {
      handleError(error, 'Failed to save sharing', {
        alert: true,
        alertMessage: 'Failed to save sharing',
      })
    }
  }

  const handlePamAdd = async () => {
    if (!pamInput.value || !selected.value) return

    await store.addPamId(selected.value.id, pamInput.value)

    pamInput.value = ''

    await refreshAllData()
  }

  const executeAction = async (action) => {
    if (!selected.value) return

    actionLoading.value = true

    try {
      await deploymentService.executeWorkflow({
        deploymentId: selected.value.id,
        actionName: action.actionName,
      })

      await store.fetchDeployments()
    } catch (error) {
      handleError(error, 'Failed to execute workflow action')
    } finally {
      actionLoading.value = false
    }
  }

  return {
    showShareModal,
    pamInput,
    actionLoading,
    selectDeployment,
    saveSharing,
    handlePamAdd,
    executeAction,
  }
}
