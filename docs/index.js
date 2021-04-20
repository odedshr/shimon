import { getPageIndex } from './book-parser.js';
import { initTableOfContents } from './toc.js';
import { getHashChangeHandler } from './hash-parser.js';
import { getPageSetter, addPageNumber } from './pagination.js';
import { getPageNumberByScroll, updateBodyHeight, setVerticalScroll } from './page-scroll.js';
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
    const pageCount = pages.length;
    const hashChangeHandler = getHashChangeHandler(pages, (page) => { setPage(page); setVerticalScroll(getPagePosition(page, pages)); });
    window.addEventListener('hashchange', hashChangeHandler);
    window.addEventListener('scroll', () => setPage(pages[getPageNumberByScroll(pageCount)]));
    window.addEventListener('resize', () => { updateBodyHeight(pageCount); refreshBookSize(); });
    embedAllSVGs();
    hashChangeHandler();
    updateBodyHeight(pageCount);
    refreshBookSize();
}
function getPagePosition(page, pages) {
    return pages.indexOf(page) / pages.length;
}
function getElementOrCreateOne(btnId) {
    return document.getElementById(btnId) || document.createElement('a');
}
window.addEventListener('load', init);
