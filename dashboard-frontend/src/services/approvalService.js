import api from '@/services/api'

export const approvalService = {
  async requestApproval(payload) {
    const { data } = await api.post('/deployments/request-approval', payload)
    return data
  },

  async approve(payload) {
    const { data } = await api.post('/deployments/approve', payload)
    return data
  },
}
