import { Page } from './Page.js';

function getPageByScroll(pages: Page[]) {
  document.body.style.height = `${window.innerHeight + (10 * pages.length)}px`;
  return pages[(Math.round(pages.length * (window.innerHeight + window.scrollY) / document.body.offsetHeight))];
}

export { getPageByScroll } 