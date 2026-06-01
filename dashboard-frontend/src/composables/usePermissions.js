import { computed } from 'vue'
import { DEPLOYMENT_STATUS, USER_ROLES } from '@/constants/deploymentConstants'

export function usePermissions(currentUser, selected) {
  const isClosed = computed(() => selected.value?.status === DEPLOYMENT_STATUS.CLOSED)
  const isDba = computed(() => currentUser.value?.roleName === USER_ROLES.DBA)
  const isDev = computed(() => currentUser.value?.roleName === USER_ROLES.DEV)
  const isApproverUser = computed(
    () => currentUser.value?.isApprover === true || currentUser.value?.isApprover === 1,
  )

  const canLock = computed(() => isDba.value && selected.value?.status === DEPLOYMENT_STATUS.OPEN)
  const canSendForApproval = computed(
    () =>
      isDba.value &&
      [DEPLOYMENT_STATUS.OPEN, DEPLOYMENT_STATUS.IN_PROGRESS].includes(selected.value?.status) &&
      !selected.value?.isApprovalRequested,
  )
  const canApprove = computed(
    () => selected.value?.status === DEPLOYMENT_STATUS.PENDING_APPROVAL && !selected.value?.isApproved,
  )
  const canReject = computed(() =>
    [DEPLOYMENT_STATUS.IN_PROGRESS, DEPLOYMENT_STATUS.PENDING_APPROVAL].includes(
      selected.value?.status,
    ),
  )
  const canRequesterReview = computed(
    () => isDba.value && selected.value?.status === DEPLOYMENT_STATUS.IN_PROGRESS,
  )
  const canCompleteAsDba = computed(
    () => isDba.value && selected.value?.status === DEPLOYMENT_STATUS.REQUESTER_REVIEW,
  )
  const canAmend = computed(
    () => isDev.value && selected.value?.status === DEPLOYMENT_STATUS.REQUESTER_REVIEW,
  )

  return {
    isClosed,
    isDba,
    isDev,
    isApproverUser,
    canLock,
    canSendForApproval,
    canApprove,
    canReject,
    canRequesterReview,
    canCompleteAsDba,
    canAmend,
  }
}
