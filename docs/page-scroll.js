const rootStyle = document.documentElement.style;
function updateBodyHeight(pageLength) {
    rootStyle.setProperty('--body-height', `${window.innerHeight + (100 * pageLength)}px`);
}
function getPageNumberByScroll(pageCount) {
    return Math.round(pageCount * window.scrollY / document.body.offsetHeight);
}
function setVerticalScroll(position) {
    window.scrollTo(0, position * document.body.offsetHeight);
}
export { updateBodyHeight, getPageNumberByScroll, setVerticalScroll };
