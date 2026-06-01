import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
  }),

  actions: {
    async fetchCurrentUser() {
      if (this.user) return // already loaded

      const res = await axios.get('https://localhost:7260/api/auth/me')

      this.user = res.data

      localStorage.setItem('user', JSON.stringify(res.data))
    },
  },
})
