import api from '@/services/api'

export const userService = {
  async getCurrentUser() {
    const { data } = await api.get('/auth/me')
    return data
  },

  async getUsers() {
    const { data } = await api.get('/users')
    return data
  },

  async getTeams() {
    const { data } = await api.get('/teams')
    return data
  },

  async getApprovers() {
    const { data } = await api.get('/users/approvers')
    return data
  },

  async getDashboardUsers() {
    const [users, teams, approvers] = await Promise.all([
      this.getUsers(),
      this.getTeams(),
      this.getApprovers(),
    ])

    return { users, teams, approvers }
  },
}
