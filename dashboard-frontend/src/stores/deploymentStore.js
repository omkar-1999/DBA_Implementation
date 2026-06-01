import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import {
  amendDeploymentRequest,
  createDeployment,
  deploymentService,
  shareDeploymentWithTeam,
  shareDeploymentWithUser,
} from '@/services/deploymentService'
import { auditService } from '@/services/auditService'
import { handleError } from '@/utils/errorHandler'

export const useDeploymentStore = defineStore('deployment', {
  state: () => ({
    deployments: [],
    comments: [],
  }),

  actions: {
    async fetchDeployments() {
      this.deployments = await deploymentService.getDeployments()
    },

    formatDate(date) {
      const d = new Date(date)

      return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    async fetchDeploymentAuditsComments(deploymentId, deploymentCode) {
      try {
        this.comments = await auditService.getAuditComments(deploymentId, deploymentCode)
      } catch (error) {
        handleError(error, 'Error fetching audits/comments')
      }
    },

    async addPamId(deploymentId, pamId) {
      try {
        const userStore = useUserStore()
        await deploymentService.addPamId({
          deployment_id: deploymentId,
          pam_id: pamId,
          user_id: userStore.user?.userId,
        })

        // OPTIONAL: update local state immediately
        const deployment = this.deployments.find((d) => d.id === deploymentId)

        if (deployment) {
          if (!deployment.pamId) {
            deployment.pamId = []
          }

          deployment.pamId.push({
            value: pamId,
          })
        }
      } catch (err) {
        handleError(err, 'Failed to add PAM ID')
      }
    },

    async addDeployment(deployment) {
      const userStore = useUserStore()
      const createdDeployment = await createDeployment(deployment, userStore.user?.userId)
      const deploymentId = createdDeployment.deployment_id

      for (const userId of deployment.sharedUsers || []) {
        await shareDeploymentWithUser(deploymentId, userId, userStore.user?.userId)
      }

      for (const teamId of deployment.sharedTeams || []) {
        await shareDeploymentWithTeam(deploymentId, teamId)
      }

      return createdDeployment
    },

    async addComment(deploymentId, commentText) {
      try {
        const userStore = useUserStore()

        const response = await deploymentService.addPlainComment({
          DeploymentId: deploymentId,
          commentText: commentText,
          userId: userStore.user?.userId, // ⚠️ ensure this exists
        })

        // push new comment to UI
        this.comments.push(response)

        return response
      } catch (error) {
        handleError(error, 'Error adding comment')
        throw error
      }
    },

    async amendDeployment(deployment) {
      try {
        const userStore = useUserStore()
        return await amendDeploymentRequest(deployment, userStore.user?.userId)
      } catch (error) {
        handleError(error, 'Amend deployment failed')

        if (error.response) {
          console.log(error.response.data)
        }

        throw error
      }
    },

    async updateDeployment(deployment) {
      await deploymentService.update(deployment)

      const index = this.deployments.findIndex((d) => d.deployment_id === deployment.deployment_id)

      if (index !== -1) {
        this.deployments[index] = deployment
      }
    },
  },
})
