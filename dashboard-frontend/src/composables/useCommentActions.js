import { ref } from 'vue'
import { COMMENT_ACTION } from '@/constants/deploymentConstants'
import { approvalService } from '@/services/approvalService'
import { deploymentService } from '@/services/deploymentService'
import { handleError } from '@/utils/errorHandler'

export function useCommentActions(currentUser, refreshAllData) {
  const showCommentModal = ref(false)
  const pendingAction = ref(null)
  const pendingDeploymentId = ref(null)
  const newComment = ref('')
  const commentRemarks = ref('')
  const commentFiles = ref([])
  const commentScreenshots = ref([])
  const commentsLoading = ref(false)

  const openCommentModal = (action, deploymentId) => {
    pendingAction.value = action
    pendingDeploymentId.value = deploymentId
    newComment.value = ''
    commentRemarks.value = ''
    commentFiles.value = []
    commentScreenshots.value = []
    showCommentModal.value = true
  }

  const removeCommentFile = (index) => {
    commentFiles.value.splice(index, 1)
  }

  const removeCommentScreenshot = (index) => {
    commentScreenshots.value.splice(index, 1)
  }

  const submitCommentAction = async () => {
    if (!newComment.value) {
      window.alert('Comment is required')
      return
    }

    commentsLoading.value = true

    try {
      const formData = new FormData()

      formData.append('DeploymentId', pendingDeploymentId.value)
      formData.append('CommentText', newComment.value)
      formData.append('UserId', currentUser.value.userId)
      formData.append('Remarks', commentRemarks.value || '')

      commentFiles.value.forEach((file) => {
        formData.append('Attachments', file)
      })

      commentScreenshots.value.forEach((file) => {
        formData.append('Screenshots', file)
      })

      await deploymentService.addComment(formData)

      if (pendingAction.value === COMMENT_ACTION.LOCK) {
        await deploymentService.lock(pendingDeploymentId.value, currentUser.value.userId)
      }

      if (pendingAction.value === COMMENT_ACTION.REJECT) {
        await deploymentService.reject(pendingDeploymentId.value, currentUser.value.userId)
      }

      if (pendingAction.value === COMMENT_ACTION.REQUESTER_REVIEW) {
        await deploymentService.requesterReview(pendingDeploymentId.value, currentUser.value.userId)
      }

      if (pendingAction.value === COMMENT_ACTION.COMPLETE) {
        await deploymentService.close(pendingDeploymentId.value, currentUser.value.userId)
      }

      if (pendingAction.value === COMMENT_ACTION.APPROVE) {
        await approvalService.approve({
          deploymentId: pendingDeploymentId.value,
          approvedBy: currentUser.value.userId,
          Remarks: commentRemarks.value || newComment.value,
        })
      }

      await refreshAllData()

      showCommentModal.value = false
    } catch (error) {
      handleError(error, 'Failed to submit comment action')
    } finally {
      commentsLoading.value = false
    }
  }

  return {
    showCommentModal,
    pendingAction,
    pendingDeploymentId,
    newComment,
    commentRemarks,
    commentFiles,
    commentScreenshots,
    commentsLoading,
    openCommentModal,
    removeCommentFile,
    removeCommentScreenshot,
    submitCommentAction,
  }
}
