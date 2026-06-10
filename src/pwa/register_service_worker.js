export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported in this browser.')
    return
  }

  window.addEventListener('load', async () => {
    try {
      const registration =
        await navigator.serviceWorker.register('/service-worker.js')

      console.log('Service worker registered:', registration.scope)
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  })
}
