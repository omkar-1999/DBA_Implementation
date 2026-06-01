import { ref } from 'vue'
import { API_BASE_URL } from '@/constants/deploymentConstants'
import { buildApiAssetUrl, isAzureLink, openExternalLink } from '@/utils/urlUtils'
import { handleError } from '@/utils/errorHandler'

export function useFileHandlers() {
  const screenshotBox = ref(null)
  const showScreenshotPlaceholder = ref(true)
  const showImageModal = ref(false)
  const selectedImage = ref('')

  const copyText = async (text, context = 'Copy') => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      console.log(`${context} copied`)
    } catch (error) {
      handleError(error, `${context} copy failed`)
    }
  }

  const downloadFile = (file) => {
    if (!file?.url) return

    const link = document.createElement('a')
    link.href = buildApiAssetUrl(file.url)
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openImageModal = (url) => {
    if (!url) return
    selectedImage.value = buildApiAssetUrl(url)
    showImageModal.value = true
  }

  const closeImageModal = () => {
    showImageModal.value = false
    selectedImage.value = ''
  }

  const onScreenshotFocus = () => {
    showScreenshotPlaceholder.value = false
  }

  const onScreenshotBlur = (event, screenshots) => {
    const editableText = event?.currentTarget?.innerText || screenshotBox.value?.innerText || ''

    if (
      screenshots.value.length === 0 &&
      (!editableText || editableText.trim() === '')
    ) {
      showScreenshotPlaceholder.value = true
    }
  }

  const appendUploadedFiles = (event, target) => {
    const files = Array.from(event.target.files)
    target.value.push(...files)
    event.target.value = ''
  }

  const pasteScreenshots = (event, target) => {
    showScreenshotPlaceholder.value = false

    const items = event.clipboardData.items

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile()
        target.value.push(file)
      }
    }
  }

  return {
    API_BASE_URL,
    screenshotBox,
    showScreenshotPlaceholder,
    showImageModal,
    selectedImage,
    copyText,
    downloadFile,
    openImageModal,
    closeImageModal,
    onScreenshotFocus,
    onScreenshotBlur,
    appendUploadedFiles,
    pasteScreenshots,
    isAzureLink,
    openExternalLink,
    buildApiAssetUrl,
  }
}
