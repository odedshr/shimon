const rootStyle = document.documentElement.style;
function updateBodyHeight(pageLength) {
    rootStyle.setProperty('--body-height', `${window.innerHeight + (100 * pageLength)}px`);
}
function getPageByScroll(pages) {
    return pages[(Math.round(pages.length * (window.innerHeight + window.scrollY) / document.body.offsetHeight))];
}
export { updateBodyHeight, getPageByScroll };
