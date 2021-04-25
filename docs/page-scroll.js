const rootStyle = document.documentElement.style;
let listenerEnabled = true;
function updateBodyHeight(pageLength) {
    rootStyle.setProperty('--body-height', `${window.innerHeight + (100 * pageLength)}px`);
}
function getPageNumberByScroll(pageCount) {
    return Math.round(pageCount * window.scrollY / document.body.offsetHeight);
}
function setVerticalScroll(position) {
    listenerEnabled = false;
    window.scrollTo(0, position * document.body.offsetHeight);
    setTimeout(() => { listenerEnabled = true; }, 0);
}
function initScrollHandler(pageList, setPage) {
    window.addEventListener('scroll', () => listenerEnabled && setPage(pageList, pageList[getPageNumberByScroll(pageList.length)]));
}
export { updateBodyHeight, initScrollHandler, setVerticalScroll };
