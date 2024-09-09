const assets = [
    '/',
    '/index.html',
    '/assets/index-tHFfWUSE.css',
    '/assets/index-CM-Le05u.js',
    '/manifest.json',
    'http://unpkg.com/boxicons@2.1.4/svg/regular/bx-check.svg',
    'http://unpkg.com/boxicons@2.1.4/svg/regular/bx-trash.svg'
];


const dynamicCacheName = 'site-dynamic';
const staticCacheName = 'site-static';


// Cache Size Limit Function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length >= size) {
                // Deleting the oldest Cache in the array
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}


// Install Service Worker
self.addEventListener('install', async e => {
    try {
        const cache = await caches.open(staticCacheName);
        console.log('Caching Shell Assets');
        // addAll method goes out to the server gets the resources then puts it inside the cache.
        cache.addAll(assets);
    }
    catch (error) {
        console.error('Error occured when installing ', error.message);
        throw error;
    }
});


// // Cache Versioning
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== staticCacheName && key !== dynamicCacheName)
                    .map(key => caches.delete(key))
            );
        })
    );
});


self.addEventListener('fetch', async e => {
    e.respondWith(
        // Example of a simple cache-first network-first strategy
        // The service worker is checking the cache for a response and if it doesn't find it, it fetches it.
        caches.match(e.request).then(res => {
            return res || fetch(e.request.url).then(fetchres => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(e.request.url, fetchres.clone());
                    // Making sure the cache isn't too large/bloating
                    limitCacheSize(dynamicCacheName, 20);
                    return fetchres;
                })
            })
        }).catch(() => {
            // Offline Fallback Page/Conditional Fallbacks
            if (e.request.url.indexOf('.html') > -1) {
                caches.match('/errorpage.html').then(res => {
                    return res;
                })
            }
        })
    );
});