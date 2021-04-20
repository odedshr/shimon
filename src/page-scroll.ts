const rootStyle = document.documentElement.style;

function updateBodyHeight(pageLength: number) {
  rootStyle.setProperty('--body-height', `${window.innerHeight + (100 * pageLength)}px`);
}

function getPageNumberByScroll(pageCount: number) {
  return Math.round(pageCount * window.scrollY / document.body.offsetHeight);
}

function setVerticalScroll(position: number) {
  window.scrollTo(0, position * document.body.offsetHeight);
}

export { updateBodyHeight, getPageNumberByScroll, setVerticalScroll }