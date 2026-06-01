import api from '@/services/api'

export const fileService = {
  async getFiles(code, version) {
    const { data } = await api.get(`/deployments/files/${code}/v${version}`)
    return data || []
  },

  async getFilesByFolder(versionFolder) {
    const { data } = await api.get(`/deployments/files/${versionFolder}`)
    return data || []
  },

  async getScreenshots(code, version) {
    const { data } = await api.get(`/deployments/screenshots/${code}/v${version}`)
    return data || []
  },

  async getScreenshotsByFolder(versionFolder) {
    const { data } = await api.get(`/deployments/screenshots/${versionFolder}`)
    return data || []
  },
}
