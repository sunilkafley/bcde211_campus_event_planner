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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log(
          'Campus Event Planner service worker registered:',
          registration,
        )
      })
      .catch((error) => {
        console.error(
          'Campus Event Planner service worker registration failed:',
          error,
        )
      })
  })
}
