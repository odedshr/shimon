var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TOCLinks, initHeaders, getTOCLinks, appendTOCLinks, clearTOCLinksPageNumbers, refreshTOCLinks } from './toc.js';
import { getPageByLocation, getCurrentPageId } from './hash-parser.js';
import { paginateBook } from './pagination.js';
import { initNavButtons, getPageSetter } from './navigation.js';
import { initScrollHandler, setVerticalScroll, updateBodyHeight } from './page-scroll.js';
import { embedAllSVGs } from './embed-svg.js';
import { PageList } from './Page.js';
import { throttle } from './throttle.js';
const pageList = new PageList();
const tocLinks = new TOCLinks();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        initNavButtons(pageList, getElementByIdOrCreateOne('btnPrev'), getElementByIdOrCreateOne('btnNext'));
        const setPage = getPageSetter();
        tocLinks.push(...getTOCLinks(initHeaders()));
        appendTOCLinks(getElementOrCreateOne('.book_toc'), tocLinks);
        yield embedAllSVGs();
        window.addEventListener('hashchange', handleHashChange.bind({}, setPage));
        window.addEventListener('resize', () => throttle(() => __awaiter(this, void 0, void 0, function* () { return pageList.set(yield formatBook(tocLinks)); }), 500));
        pageList.set(yield formatBook(tocLinks));
        handleHashChange(setPage);
        initScrollHandler(pageList, setPage);
    });
}
function handleHashChange(setPage) {
    const page = getPageByLocation(pageList);
    setPage(pageList, page);
    setVerticalScroll(getPagePosition(page, pageList));
}
function getPagePosition(page, pages) {
    return pages.indexOf(page) / pages.length;
}
function updateProgress(value) {
    if (value === -1) {
        document.body.setAttribute('data-state', 'loading-background');
    }
    else {
        document.body.setAttribute('data-loading', ".".repeat(Math.floor(value * 100 / 8)));
    }
}
function formatBook(tocLinks) {
    return __awaiter(this, void 0, void 0, function* () {
        document.body.setAttribute('data-state', 'loading');
        clearTOCLinksPageNumbers();
        const pages = yield paginateBook(updateProgress, getCurrentPageId());
        refreshTOCLinks(tocLinks, pages);
        updateBodyHeight(pageList.length);
        document.body.setAttribute('data-state', 'idle');
        document.body.removeAttribute('data-loading');
        return pages;
    });
}
function getElementByIdOrCreateOne(elmId, tag = 'a') {
    return document.getElementById(elmId) || document.createElement(tag);
}
function getElementOrCreateOne(query, tag = 'a') {
    return (document.querySelector(query) || document.createElement(tag));
}
window.addEventListener('load', init);
