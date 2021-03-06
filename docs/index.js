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
import { paginateBook, getPages } from './pagination.js';
import { initNavButtons, getPageSetter, updatePagePositionDescription } from './navigation.js';
import { initScrollHandler, setVerticalScroll, updateBodyHeight } from './page-scroll.js';
import { embedAllSVGs } from './embed-svg.js';
import { PageList } from './Page.js';
import { getResizeHandler, isResizingRequired } from './resize-handler.js';
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
        window.addEventListener('resize', getResizeHandler());
        window.addEventListener('resize-end', () => __awaiter(this, void 0, void 0, function* () { return isResizingRequired() ? pageList.set(yield formatBook(tocLinks)) : true; }));
        pageList.set(isResizingRequired() ? yield formatBook(tocLinks) : getInitialPages(tocLinks));
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
        updateBodyHeight(pages.length);
        document.body.setAttribute('data-state', 'idle');
        document.body.removeAttribute('data-loading');
        return pages;
    });
}
function getInitialPages(tocLinks) {
    var _a;
    const pages = getPages(getCurrentPageId());
    updatePagePositionDescription(((_a = pages.getCurrent()) === null || _a === void 0 ? void 0 : _a.id) || 0, pages.length);
    refreshTOCLinks(tocLinks, pages);
    updateBodyHeight(pages.length);
    return pages;
}
function getElementByIdOrCreateOne(elmId, tag = 'a') {
    return document.getElementById(elmId) || document.createElement(tag);
}
function getElementOrCreateOne(query, tag = 'a') {
    return (document.querySelector(query) || document.createElement(tag));
}
window.addEventListener('load', init);
