import api from '@/services/api'

function toAuditComment(comment, deploymentCode) {
  return {
    deploymentId: comment.deployment_id,
    activityType: comment.activity_type,
    commentText: comment.comment_text,
    Remarks: comment.Remarks,
    userName: comment.user_name,
    activityTime: comment.activity_time,
    version_number: comment.version_number || 1,
    attachments: comment.attachment
      ? comment.attachment
          .split(',')
          .filter(Boolean)
          .map((file) => ({
            name: file.split('/').pop(),
            url: `/api/dashboard/auditscomments/${deploymentCode}/${file}`,
          }))
      : [],
    screenshots: comment.screenshots
      ? comment.screenshots
          .split(',')
          .filter(Boolean)
          .map((screenshot, index) => ({
            name: `screenshot${index + 1}`,
            url: `/api/dashboard/auditscomments/${deploymentCode}/${screenshot}`,
          }))
      : [],
  }
}

export const auditService = {
  async getRawAuditComments(deploymentId) {
    const { data } = await api.get(`/dashboard/auditscomments/${deploymentId}`)
    return data
  },

  async getAuditComments(deploymentId, deploymentCode) {
    const data = await this.getRawAuditComments(deploymentId)
    return data.map((comment) => toAuditComment(comment, deploymentCode))
  },

  async getVersionDetails(deploymentId, version) {
    const { data } = await api.get(`/dashboard/version-details/${deploymentId}/${version}`)
    return data
  },
}
