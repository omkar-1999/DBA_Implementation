import { defineStore } from 'pinia'
import api from '@/services/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
  }),

  actions: {
    async fetchCurrentUser() {
      if (this.user) return

      const { data } = await api.get('/auth/me')

      this.user = data

      localStorage.setItem('user', JSON.stringify(data))
    },
  },
})