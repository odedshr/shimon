import { PageList, Page } from './Page.js';

const rootStyle = document.documentElement.style;
let listenerEnabled = true;

function updateBodyHeight(pageLength: number) {
  rootStyle.setProperty('--body-height', `${window.innerHeight + (100 * pageLength)}px`);
}

function getPageNumberByScroll(pageCount: number) {
  return Math.round(pageCount * window.scrollY / document.body.offsetHeight);
}

function setVerticalScroll(position: number) {
  listenerEnabled = false;
  window.scrollTo(0, position * document.body.offsetHeight);
  // enable the listener back at the end of the breath;
  setTimeout(() => { listenerEnabled = true; }, 0);
}

function initScrollHandler(pageList: PageList, setPage: (pages: PageList, page: Page) => void) {
  window.addEventListener('scroll', () => listenerEnabled && setPage(pageList, pageList[getPageNumberByScroll(pageList.length)]));
}

export { updateBodyHeight, initScrollHandler, setVerticalScroll }