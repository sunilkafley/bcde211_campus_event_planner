import { useState, useEffect } from 'react'

export function OfflineBanner() {
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)

    useEffect(() => {
        function handleOnline() {
            setIsOnline(true)
        }
        function handleOffline() {
            setIsOnline(false)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    },[])

    if (isOnline) {
        return null
    }

    return (
        <>
            <div className="offline-banner">
                You are currently offline. There is no internet connection. Please check your network settings.
            </div>
        </>
    )
}