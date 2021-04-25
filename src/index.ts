import { TOCLinks, initHeaders, getTOCLinks, appendTOCLinks, clearTOCLinksPageNumbers, refreshTOCLinks } from './toc.js';
import { getPageByLocation, getCurrentPageId } from './hash-parser.js';
import { paginateBook } from './pagination.js';
import { initNavButtons, getPageSetter, getCurrentPage, updatePagePositionDescription } from './navigation.js';
import { initScrollHandler, setVerticalScroll, updateBodyHeight } from './page-scroll.js';
import { embedAllSVGs } from './embed-svg.js';
import { Page, PageList } from './Page.js';
import { throttle } from './throttle.js';

const pageList: PageList = new PageList();
const tocLinks: TOCLinks = new TOCLinks();

async function init() {
  initNavButtons(pageList, getElementByIdOrCreateOne('btnPrev'), getElementByIdOrCreateOne('btnNext'));

  const setPage = getPageSetter();

  tocLinks.push(...getTOCLinks(initHeaders()));
  // add anchors to headers; create table of content links based on headers and adds them to the page;
  appendTOCLinks(
    getElementOrCreateOne('.book_toc'),
    tocLinks
  );

  await embedAllSVGs();

  window.addEventListener('hashchange', handleHashChange.bind({}, setPage));
  window.addEventListener('resize', () => throttle(async () => pageList.set(await formatBook(tocLinks)), 500));

  pageList.set(await formatBook(tocLinks));
  handleHashChange(setPage);

  initScrollHandler(pageList, setPage);
}

function handleHashChange(setPage: (pages: PageList, page: Page) => void) {
  const page = getPageByLocation(pageList);
  setPage(pageList, page);
  setVerticalScroll(getPagePosition(page, pageList));
}

function getPagePosition(page: Page, pages: Page[]) {
  return pages.indexOf(page) / pages.length;
}

function updateProgress(value: number) {
  if (value === -1) {
    document.body.setAttribute('data-state', 'loading-background');
  } else {
    document.body.setAttribute('data-loading', ".".repeat(Math.floor(value * 100 / 8)));
  }
}

async function formatBook(tocLinks: TOCLinks) {
  document.body.setAttribute('data-state', 'loading');

  clearTOCLinksPageNumbers();

  const pages = await paginateBook(updateProgress, getCurrentPageId());

  refreshTOCLinks(tocLinks, pages);

  updateBodyHeight(pageList.length);

  document.body.setAttribute('data-state', 'idle');
  document.body.removeAttribute('data-loading');

  return pages;
}

function getElementByIdOrCreateOne(elmId: string, tag: string = 'a') {
  return document.getElementById(elmId) || document.createElement(tag);
}

function getElementOrCreateOne(query: string, tag: string = 'a') {
  return (document.querySelector(query) || document.createElement(tag)) as HTMLElement;
}

window.addEventListener('load', init);