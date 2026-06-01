import api from './api'
import { WORKFLOW_STATUS_ID } from '@/constants/deploymentConstants'

export async function getDatabases() {
  const { data } = await api.get('/databases')
  return data
}

export async function getUsers() {
  const { data } = await api.get('/users')
  return data
}

export async function getTeams() {
  const { data } = await api.get('/teams')
  return data
}

export async function getDeploymentById(id) {
  const { data } = await api.get(`/dashboard/latest-deployment/${id}`)
  return data
}

export async function getDeploymentFiles(code, version) {
  const { data } = await api.get(`/deployments/files/${code}/v${version}`)

  return data
}

export async function getDeploymentScreenshots(code, version) {
  const { data } = await api.get(`/deployments/screenshots/${code}/v${version}`)

  return data
}

export async function getInitialDeploymentData() {
  const [databases, users, teams] = await Promise.all([getDatabases(), getUsers(), getTeams()])

  return {
    databases,
    users,
    teams,
  }
}

function appendFormFields(formData, payload) {
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item))
      return
    }

    formData.append(key, value ?? '')
  })
}

function appendUploadFiles(formData, fieldName, files = []) {
  files.forEach((file) => {
    if (file instanceof Blob) {
      formData.append(fieldName, file)
    }
  })
}

export async function createDeployment(deployment, userId) {
  const formData = new FormData()

  appendFormFields(formData, {
    deploymentCode: deployment.id,
    databaseId: deployment.database,
    requestedBy: userId,
    reason: deployment.reason,
    deploymentUrl: deployment.deploymentUrl,
    changeRequest: deployment.changeRequest,
    prNumber: deployment.prNumber,
    prApprovalUrl: deployment.prApprovalUrl,
    SqlScript: deployment.SqlScript ?? '',
    Remarks: deployment.Remarks ?? '',
    ScheduleAt: deployment.scheduleAt || '',
    sharedUsers: deployment.sharedUsers || [],
    sharedTeams: deployment.sharedTeams || [],
  })

  appendUploadFiles(formData, 'Files', deployment.deploymentFiles)
  appendUploadFiles(formData, 'Screenshots', deployment.screenshots)

  const { data } = await api.post('/deployments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data
}

export async function amendDeploymentRequest(deployment, userId) {
  const formData = new FormData()

  appendFormFields(formData, {
    DeploymentId: deployment.id,
    Reason: deployment.reason || '',
    UserId: userId,
    SqlScript: deployment.SqlScript || '',
    Remarks: deployment.Remarks || '',
    DeploymentUrl: deployment.deploymentUrl || '',
    ChangeRequest: deployment.changeRequest || '',
    PrNumber: deployment.prNumber || '',
    PrApprovalUrl: deployment.prApprovalUrl || '',
  })

  appendUploadFiles(formData, 'Files', deployment.deploymentFiles)
  appendUploadFiles(formData, 'Screenshots', deployment.screenshots)

  const { data } = await api.post('/deployments/amend', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data
}

export async function shareDeploymentWithUser(deploymentId, userId, sharedBy) {
  const { data } = await api.post('/deployments/share/user', {
    deployment_id: deploymentId,
    user_id: userId,
    shared_by: sharedBy,
  })

  return data
}

export async function shareDeploymentWithTeam(deploymentId, teamId) {
  const { data } = await api.post('/deployments/share/team', {
    deployment_id: deploymentId,
    team_id: teamId,
  })

  return data
}

export function mapDashboardDeployment(d) {
  return {
    id: d.deployment_id,
    code: d.deployment_code,
    database: d.database_name,
    requestedBy: d.requested_by,
    date: new Date(d.created_date).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    reason: d.reason,
    status: d.status_name,
    isApproved: d.is_approved === 1,
    deploymentUrl: d.deployment_url,
    changeRequest: d.change_request,
    prNumber: d.pr_number,
    SqlScript: d.sqlScript,
    Remarks: d.remarks,
    scheduleAt: d.scheduleAt
      ? new Date(d.scheduleAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-',
    prApprovalUrl: d.pr_approval_url,
    version_number: d.version_number,
    sharedUsers: d.shared_users ? d.shared_users.split(',') : [],
    sharedTeams: d.shared_teams ? d.shared_teams.split(',') : [],
    sharedUsersIds: d.shared_user_ids || [],
    sharedTeamsIds: d.shared_team_ids || [],
    pam_ids: d.pam_ids ?? null,
    approvers: d.approvers || [],
    isApprovalRequested: d.isApprovalRequested,
  }
}

export const deploymentService = {
  async getDeployments() {
    const { data } = await api.get('/dashboard/deployments')
    return data.map(mapDashboardDeployment)
  },

  async getDeploymentById(id) {
    return getDeploymentById(id)
  },

  async create(deployment, userId) {
    return createDeployment(deployment, userId)
  },

  async amend(deployment, userId) {
    return amendDeploymentRequest(deployment, userId)
  },

  async lock(deploymentId, userId) {
    const { data } = await api.post('/deployments/lock', {
      deploymentId,
      statusId: WORKFLOW_STATUS_ID.LOCKED,
      userId,
    })
    return data
  },

  async reject(deploymentId, userId) {
    const { data } = await api.post('/deployments/reject', {
      deploymentId,
      statusId: WORKFLOW_STATUS_ID.REJECTED,
      userId,
    })
    return data
  },

  async requesterReview(deploymentId, userId) {
    const { data } = await api.post('/deployments/requesterreview', {
      deploymentId,
      statusId: WORKFLOW_STATUS_ID.REQUESTER_REVIEW,
      userId,
    })
    return data
  },

  async close(deploymentId, userId) {
    const { data } = await api.post('/deployments/close', {
      deploymentId,
      statusId: WORKFLOW_STATUS_ID.CLOSED,
      userId,
    })
    return data
  },

  async addComment(formData) {
    const { data } = await api.post('/deployments/add-comment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async addPlainComment(payload) {
    const { data } = await api.post('/deployments/add-comment', payload)
    return data
  },

  async addPamId(payload) {
    const { data } = await api.post('/deployments/pam', payload)
    return data
  },

  async executeWorkflow(payload) {
    const { data } = await api.post('/workflow/execute', payload)
    return data
  },

  async update(deployment) {
    const { data } = await api.put(`/dashboard/deployments/${deployment.deployment_id}`, deployment)
    return data
  },
}
