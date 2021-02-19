import { getPageIndex } from './book-parser.js';
import { initTableOfContents } from './toc.js';
import { getHashChangeHandler } from './hash-parser.js';
import { getPageSetter, addPageNumber } from './pagination.js';



function init() {
  const pages = getPageIndex('.book .page');

  addPageNumber(pages);

  const tocElm: HTMLElement | null = document.querySelector('.book_toc')
  if (tocElm) {
    initTableOfContents(pages, tocElm);
  }
  const setPage = getPageSetter(
    pages,
    document.querySelector('.book_nav_backward') as HTMLElement || undefined,
    document.querySelector('.book_nav_forward') as HTMLElement || undefined
  )

  const hashChangeHandler = getHashChangeHandler(pages, setPage);
  window.addEventListener('hashchange', hashChangeHandler);

  // move to current page
  hashChangeHandler();
}


window.addEventListener('load', init);