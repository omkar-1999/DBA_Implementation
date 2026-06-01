export function handleError(error, context = 'Operation failed', options = {}) {
  const message = error?.response?.data?.message || error?.message || context

  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error)
  } else {
    console.error(context)
  }

  if (options.alert) {
    window.alert(options.alertMessage || message)
  }

  return message
}
