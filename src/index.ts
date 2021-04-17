import { getPageIndex } from './book-parser.js';
import { initTableOfContents } from './toc.js';
import { getHashChangeHandler } from './hash-parser.js';
import { getPageSetter, addPageNumber } from './pagination.js';
import { getPageByScroll } from './page-scroll.js';
import { embedAllSVGs } from './embed-svg.js';
import { refreshBookSize } from './book-resize.js';

function init() {
  const pages = getPageIndex('.book .page');

  addPageNumber(pages);

  const tocElm: HTMLElement | null = document.querySelector('.book_toc')
  if (tocElm) {
    initTableOfContents(pages, tocElm);
  }

  const btnTOC = getElementOrCreateOne('btnTOC');
  const btnPrev = getElementOrCreateOne('btnPrev');
  const btnNext = getElementOrCreateOne('btnNext');

  const setPage = getPageSetter(
    pages,
    btnTOC,
    btnPrev,
    btnNext
  )

  const bookElmStyle = ((document.querySelector('.book') || document.createElement('main')) as HTMLElement).style;


  const hashChangeHandler = getHashChangeHandler(pages, setPage);
  window.addEventListener('hashchange', hashChangeHandler);
  window.addEventListener('scroll', () => setPage(getPageByScroll(pages)));
  window.addEventListener('resize', () => refreshBookSize(bookElmStyle));

  embedAllSVGs();

  // move to current page
  hashChangeHandler();

  refreshBookSize(bookElmStyle);
}

function getElementOrCreateOne(btnId: string) {
  return document.getElementById(btnId) || document.createElement('a');
}

window.addEventListener('load', init);