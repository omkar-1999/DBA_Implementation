import api from '@/services/api'

export const shareService = {
  async shareWithUser(payload) {
    const { data } = await api.post('/deployments/share/user', payload)
    return data
  },

  async shareWithTeam(payload) {
    const { data } = await api.post('/deployments/share/team', payload)
    return data
  },
}
