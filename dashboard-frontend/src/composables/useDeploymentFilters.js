import { computed, ref, watch } from 'vue'
import { DEPLOYMENT_STATUS, USER_ROLES } from '@/constants/deploymentConstants'

export function useDeploymentFilters(store, currentUser, selected) {
  const selectedDatabase = ref('')
  const developerFilter = ref('')
  const activeStatus = ref('')

  const filteredDeployments = computed(() => {
    return store.deployments.filter((deployment) => {
      const statusMatch = activeStatus.value
        ? activeStatus.value === DEPLOYMENT_STATUS.OPEN
          ? deployment.status === DEPLOYMENT_STATUS.OPEN ||
            deployment.status === DEPLOYMENT_STATUS.APPROVED
          : deployment.status === activeStatus.value
        : true

      const dbMatch = selectedDatabase.value
        ? deployment.database === selectedDatabase.value
        : true

      const devMatch = developerFilter.value
        ? deployment.requestedBy?.toLowerCase().includes(developerFilter.value.toLowerCase())
        : true

      const sharedMatch =
        deployment.requestedBy === currentUser.value?.displayName ||
        (deployment.sharedUsers && deployment.sharedUsers.includes(currentUser.value?.displayName)) ||
        currentUser.value?.roleName === USER_ROLES.DBA

      const approverMatch =
        activeStatus.value === DEPLOYMENT_STATUS.PENDING_APPROVAL
          ? !deployment.approvers?.length ||
            deployment.approvers?.some((approver) => !approver.isApproved)
          : true

      return statusMatch && dbMatch && devMatch && sharedMatch && approverMatch
    })
  })

  const statusCounts = computed(() => ({
    all: store.deployments?.length,
    open: store.deployments.filter((d) => d.status === DEPLOYMENT_STATUS.OPEN).length,
    inProgress: store.deployments.filter(
      (d) => d.status === DEPLOYMENT_STATUS.IN_PROGRESS || d.status === DEPLOYMENT_STATUS.APPROVED,
    ).length,
    requesterReview: store.deployments.filter(
      (d) => d.status === DEPLOYMENT_STATUS.REQUESTER_REVIEW,
    ).length,
    closed: store.deployments.filter((d) => d.status === DEPLOYMENT_STATUS.CLOSED).length,
    pendingApproval: store.deployments.filter(
      (d) => d.status === DEPLOYMENT_STATUS.PENDING_APPROVAL,
    ).length,
  }))

  const hasPendingApprovals = computed(() => statusCounts.value.pendingApproval > 0)

  watch([activeStatus, selectedDatabase, developerFilter], () => {
    if (selected.value && !filteredDeployments.value.some((d) => d.id === selected.value.id)) {
      selected.value = null
    }
  })

  return {
    selectedDatabase,
    developerFilter,
    activeStatus,
    filteredDeployments,
    statusCounts,
    hasPendingApprovals,
  }
}
