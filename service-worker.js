const CACHE_NAME = "campus-event-planner-shell-v1";

self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
});
self.addEventListener("activate", (event) => {
    console.log("Service Worker activating.");
});
self.addEventListener("fetch", (event) => {
    console.log("Service Worker fetching:", event.request.url);
});