import { useState, useEffect } from 'react'

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)

  // useEffect runs code after the component appears on the screen
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }
    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    // React runs this cleanup when component unmounts or the effect reruns
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, []) // empty dependency array means this effect only runs once, when the component first appears

  useEffect(() => {
    if (isOnline) {
      document.body.classList.remove('offline')
    } else {
      document.body.classList.add('offline')
    }
  }, [isOnline])

  if (isOnline) {
    return null
  }

  return (
    <div className="offline-banner">
      You appear to be offline. Campus Event Planner is currently operating with
      cached data.
    </div>
  )
}
