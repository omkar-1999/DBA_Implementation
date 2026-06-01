import { API_BASE_URL } from '@/constants/deploymentConstants'

export function buildApiAssetUrl(path) {
  if (!path) return ''
  return `${API_BASE_URL}${path}`
}

export function isAzureLink(url) {
  return (
    !!url &&
    (url.toLowerCase().includes('n8projects.visualstudio.com') ||
      url.toLowerCase().includes('dev.azure.com'))
  )
}

export function normalizeExternalUrl(url) {
  if (!url) return ''
  return url.startsWith('http') ? url : `https://${url}`
}

export function openExternalLink(url) {
  const formattedUrl = normalizeExternalUrl(url)
  if (formattedUrl) {
    window.open(formattedUrl, '_blank')
  }
}
