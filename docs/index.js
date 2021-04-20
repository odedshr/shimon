import { getPageIndex } from './book-parser.js';
import { initTableOfContents } from './toc.js';
import { getHashChangeHandler } from './hash-parser.js';
import { getPageSetter, addPageNumber } from './pagination.js';
import { getPageByScroll, updateBodyHeight } from './page-scroll.js';
import { embedAllSVGs } from './embed-svg.js';
import { refreshBookSize } from './book-resize.js';
function init() {
    const pages = getPageIndex('.book .page');
    addPageNumber(pages);
    const tocElm = document.querySelector('.book_toc');
    if (tocElm) {
        initTableOfContents(pages, tocElm);
    }
    const btnTOC = getElementOrCreateOne('btnTOC');
    const btnPrev = getElementOrCreateOne('btnPrev');
    const btnNext = getElementOrCreateOne('btnNext');
    const setPage = getPageSetter(pages, btnTOC, btnPrev, btnNext);
    const hashChangeHandler = getHashChangeHandler(pages, setPage);
    window.addEventListener('hashchange', hashChangeHandler);
    window.addEventListener('scroll', () => { updateBodyHeight(pages.length); setPage(getPageByScroll(pages)); });
    window.addEventListener('resize', () => refreshBookSize());
    embedAllSVGs();
    hashChangeHandler();
    updateBodyHeight(pages.length);
    refreshBookSize();
}
function getElementOrCreateOne(btnId) {
    return document.getElementById(btnId) || document.createElement('a');
}
window.addEventListener('load', init);
