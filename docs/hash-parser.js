function getCurrentPageId() {
    return location.hash.substr(1) || 'page-1';
}
function getPageByLocation(pages) {
    return pages.get(getCurrentPageId()) || pages[0];
}
function updateLocation(newPageHash) {
    location.hash = newPageHash;
}
export { getPageByLocation, getCurrentPageId, updateLocation };
