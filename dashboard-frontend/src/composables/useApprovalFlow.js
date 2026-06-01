import { ref } from 'vue'
import { approvalService } from '@/services/approvalService'
import { handleError } from '@/utils/errorHandler'

export function useApprovalFlow(selected, currentUser, refreshAllData) {
  const showApprovalModal = ref(false)
  const selectedApprovers = ref([])
  const loading = ref(false)

  const sendForApproval = async () => {
    if (!selected.value) return

    loading.value = true

    try {
      await Promise.all(
        selectedApprovers.value.map((userId) =>
          approvalService.requestApproval({
            deployment_Id: selected.value.id,
            approver_Id: userId,
            requested_By: currentUser.value.userId,
          }),
        ),
      )

      showApprovalModal.value = false
      selectedApprovers.value = []

      await refreshAllData()
    } catch (error) {
      handleError(error, 'Failed to send for approval', {
        alert: true,
        alertMessage: 'Failed to send for approval',
      })
    } finally {
      loading.value = false
    }
  }

  return {
    showApprovalModal,
    selectedApprovers,
    approvalLoading: loading,
    sendForApproval,
  }
}
