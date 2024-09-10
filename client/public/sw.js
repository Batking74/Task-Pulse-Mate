const staticCacheName = 'site-cache-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
    '/',
    '/index.html',
    '/Error.html',
    '/manifest.json',
    '/assets/index-BNquMB4d.js',
    '/assets/index-tHFfWUSE.css'
];

// Install Event
self.addEventListener('install', event => event.waitUntil(handleInstall()));

// Activate Event
self.addEventListener('activate', event => event.waitUntil(handleActivate()));

// Fetch Event
self.addEventListener('fetch', event => event.respondWith(handleFetch(event)));

// Pre-Caching Assets
async function handleInstall() {
    try {
        const cache = await caches.open(staticCacheName);
        console.log('Caching assets during install');
        await cache.addAll(assets);
    }
    catch (error) {
        console.error('Failed to cache assets during install:', error);
    }
}


async function handleActivate() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(cacheName => cacheName !== staticCacheName ? caches.delete(cacheName) : null));
        console.log('Old caches cleaned up');
    }
    catch (error) {
        console.error('Failed to clean up old caches:', error);
    }
}


async function handleFetch(event) {
    try {
        // Check if the request is in the Api Cache
        const cache = await caches.match(event.request);
        if (cache) return cache;

        // Check if the request is in IndexDB
        const cachedResponseBlob = await getCachedResponse(event.request.url);
        if (cachedResponseBlob) return new Response(cachedResponseBlob);

        // Fetch from the Network
        const response = await fetch(event.request);
        const cacheStore = await caches.open(staticCacheName);

        // Cache to both IndexDB and Api Cache
        await cacheStore.put(event.request, response.clone());
        await cacheAPIResponse(event.request.url, await response.clone().blob());
        return response;
    }
    catch (error) {
        // Offline Fallback Page/Conditional Fallbacks
        return caches.match('/Error.html');
    }
}




// Database
const storeName = 'APIResponses';

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('api-cache', 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: 'RequestURL' });
        };
        request.onsuccess = (event) => {
            console.log('Api-Cache Database opened successfully!');
            resolve(event.target.result);
        }
        request.onerror = (event) => {
            console.error('Api-Cache Database error: ', event.target.errorCode);
            reject(event.target.errorCode);
        }
    });
}

// Caches New APIResponse in indexDB
function cacheAPIResponse(RequestURL, Response) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = await database.transaction([storeName], 'readwrite');
            const objectStore = await transaction.objectStore(storeName);
            const request = await objectStore.put({ RequestURL, Response });

            request.onsuccess = () => resolve('APIResponse Cached Successfully');
            request.onerror = (event) => {
                console.error('Error Caching APIResponse to indexDB:', event.target.errorCode);
                reject(event.target.errorCode);
            }
        }
        catch (error) {
            console.error('Error in cacheAPIResponse Function:', error);
            throw error;
        }
    });
}

// Retrieves an APIResponse if exists in indexDB
function getCachedResponse(requestURL) {
    return new Promise(async (resolve, reject) => {
        try {
            const database = await openDatabase();
            const transaction = database.transaction([storeName], 'readonly');
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.get(requestURL);

            request.onsuccess = () => {
                if (request.result) {
                    console.log('APIResponse Retrieved:', request.result);
                    resolve(request.result.Response);
                }
                else resolve(null);
                resolve(request.result);
            }
            request.onerror = (event) => {
                console.error('Error Retrieving APIResponse:', event.target.errorCode);
                reject(event.target.errorCode);
            }
        }
        catch (error) {
            console.error('Error in Opening Database in getCachedResponse() Function:', error);
            throw error;
        }
    });
}