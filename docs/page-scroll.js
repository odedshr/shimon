function getPageByScroll(pages) {
    document.body.style.height = `${window.innerHeight + (10 * pages.length)}px`;
    return pages[(Math.round(pages.length * (window.innerHeight + window.scrollY) / document.body.offsetHeight))];
}
export { getPageByScroll };
