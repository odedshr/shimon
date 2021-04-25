var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PageList } from './Page.js';
function getAnchor(pageId) {
    const anchor = document.createElement('a');
    anchor.classList.add('page-anchor');
    anchor.setAttribute('name', pageId);
    anchor.setAttribute('hidden', 'true');
    return anchor;
}
function getNewPage(id, tocSlug) {
    const slug = `page-${id + 1}`;
    const pageElm = document.createElement('article');
    pageElm.classList.add('page');
    pageElm.setAttribute('name', slug);
    pageElm.appendChild(getAnchor(slug));
    const pageContentElm = document.createElement('section');
    pageContentElm.classList.add('page_content');
    pageElm.appendChild(pageContentElm);
    return { pageElm, pageContentElm, id, slug, tocSlug };
}
function addPage(pageList, bookElm, headerSlug) {
    const page = getNewPage(pageList.length, headerSlug);
    pageList.push(page);
    bookElm.appendChild(page.pageElm);
    return page;
}
function isMatch(page, slug) {
    return page.slug === slug || page.tocSlug === slug;
}
function removeAllPages() {
    [...document.querySelectorAll('.page')].forEach(page => page.remove());
}
function paginateBook(report, currentPageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookElm = document.querySelector('.book') || document.createElement('div');
        const pageList = new PageList();
        const items = [...document.querySelectorAll('.page_content > *:not(.page-anchor)')];
        const itemCount = items.length - 1;
        removeAllPages();
        let page = addPage(pageList, bookElm, undefined);
        let section = page.pageContentElm;
        const maxHeight = section.offsetHeight;
        let i = 0;
        const addNextItem = (resolve) => setTimeout(() => {
            const item = items[i];
            const itemIsHeader = (item.nodeName[0] === 'H' && section.children.length > 0);
            if (!itemIsHeader) {
                section.appendChild(item);
            }
            if (section.scrollHeight > maxHeight || itemIsHeader) {
                if (isMatch(page, currentPageId)) {
                    pageList.setCurrent(page);
                    report(-1, page);
                }
                page = addPage(pageList, bookElm, item.getAttribute('name') || undefined);
                section = page.pageContentElm;
                section.appendChild(item);
            }
            report(i / itemCount, page);
            if (++i <= itemCount) {
                addNextItem(resolve);
            }
            else {
                if (pageList.length % 2) {
                    addPage(pageList, bookElm);
                }
                resolve(pageList);
            }
        }, 0);
        return new Promise(addNextItem);
    });
}
export { paginateBook };
