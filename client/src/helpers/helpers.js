// Registering Service Worker for PWA
export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js', { type: 'classic' });
        }
        catch (error) {
            console.error('Service Worker not registered: ', error);
            throw error;
        }
    }
}