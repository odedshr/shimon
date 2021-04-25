var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { throttle } from './throttle.js';
import { parsePage } from './book-parser.js';
const minBookWidth = 800;
function getCurrentPage(pages) {
    const pageElm = document.querySelector('[data-page="current"]');
    return pages.find(page => (page.pageElm === pageElm)) || pages[0];
}
function getStepSize(currentPageIndex) {
    if (window.innerWidth > minBookWidth && !(currentPageIndex % 2)) {
        return 2;
    }
    return 1;
}
function setCurrentPage(pages, currentPage, newCurrentIndex) {
    currentPage.pageElm.removeAttribute('data-page');
    if (window.innerWidth > minBookWidth && (newCurrentIndex % 2)) {
        newCurrentIndex--;
    }
    const newCurrentPage = pages[newCurrentIndex];
    if (newCurrentPage) {
        newCurrentPage.pageElm.setAttribute('data-page', 'current');
    }
    return newCurrentPage;
}
function animatePageFlip(setCurrentPage, currentPage, isStepForward) {
    return new Promise(resolve => {
        !isStepForward && (currentPage = setCurrentPage());
        currentPage.pageElm.setAttribute('data-anim', isStepForward ? 'forward' : 'backward');
        setTimeout(() => {
            currentPage.pageElm.removeAttribute('data-anim');
            isStepForward && setCurrentPage();
            resolve(currentPage);
        }, 500);
    });
}
function updateHashTag(newPageHash) {
    location.hash = newPageHash.substr(1);
}
function getAnchor(pageId) {
    const anchor = document.createElement('a');
    anchor.setAttribute('name', pageId);
    anchor.setAttribute('hidden', 'true');
    return anchor;
}
function getNewPage(bookElm, newPageElements) {
    const page = document.createElement('article');
    newPageElements.push(page);
    const pageId = `page-${newPageElements.length}`;
    page.classList.add('page');
    page.setAttribute('name', pageId);
    page.appendChild(getAnchor(pageId));
    bookElm.appendChild(page);
    return page;
}
function getPageSection(page) {
    const section = document.createElement('section');
    section.classList.add('page_content');
    page.appendChild(section);
    return section;
}
function paginateBook(report, currentPageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPageElements = [];
        const items = Array.from(document.querySelectorAll('.page > *:not(a[name])'));
        const itemCount = items.length - 1;
        const bookElm = document.querySelector('.book') || document.createElement('div');
        const addPage = () => getNewPage(bookElm, newPageElements);
        Array.from(document.querySelectorAll('.page')).forEach(page => page.remove());
        let page = addPage();
        let section = getPageSection(page);
        return new Promise(resolve => {
            items.forEach((item, i) => setTimeout(() => {
                report(i / itemCount);
                const itemIsHeader = (item.nodeName[0] === 'H' && section.children.length > 1);
                let oldPage = false;
                !itemIsHeader && section.appendChild(item);
                if (section.scrollHeight > section.offsetHeight || itemIsHeader) {
                    oldPage = page;
                    page = addPage();
                    section = getPageSection(page);
                    section.appendChild(item);
                }
                if ((oldPage && oldPage.getAttribute('name') === currentPageId) ||
                    (itemIsHeader && item.getAttribute('name') === currentPageId)) {
                    report(-1);
                }
                if (i === itemCount) {
                    resolve(newPageElements.map(parsePage));
                }
            }, 0));
        });
    });
}
function updateNavButton(btnElm, pageNumber) {
    if (pageNumber < 0) {
        btnElm.setAttribute('disabled', 'true');
        return;
    }
    btnElm.removeAttribute('disabled');
}
function updatePreviousButton(btnElm, pages, pageNumber) {
    updateNavButton(btnElm, pageNumber);
    (pageNumber >= 0) && btnElm.setAttribute('href', `#${pages[pageNumber].name}`);
}
function updateNextButton(btnElm, pages, pageNumber) {
    if (pageNumber >= pages.length) {
        btnElm.setAttribute('disabled', 'true');
        return;
    }
    btnElm.removeAttribute('disabled');
    btnElm.setAttribute('href', `#${pages[pageNumber].name}`);
}
function preventDefaultAndThrottle(func, evt) {
    evt.preventDefault();
    throttle(func.bind(evt.target, evt), 500);
    return false;
}
function getPageSetter(tocBtn, prevBtn, nextBtn) {
    prevBtn.addEventListener('click', evt => preventDefaultAndThrottle(updateHashTag.bind({}, prevBtn.getAttribute('href') || '#'), evt));
    nextBtn.addEventListener('click', evt => preventDefaultAndThrottle(updateHashTag.bind({}, nextBtn.getAttribute('href') || '#'), evt));
    return (pages, page) => __awaiter(this, void 0, void 0, function* () {
        let currentPage = getCurrentPage(pages);
        const pageNumber = page.id;
        const stepSize = getStepSize(pageNumber);
        const step = pageNumber < currentPage.id ? -stepSize : stepSize;
        if (currentPage.id !== page.id) {
            yield animatePageFlip(() => (currentPage = setCurrentPage(pages, currentPage, pageNumber)), currentPage, step > 0);
        }
        updateNavButton(tocBtn, pageNumber - stepSize);
        updatePreviousButton(prevBtn, pages, pageNumber - stepSize);
        updateNextButton(nextBtn, pages, pageNumber + stepSize);
        location.hash = currentPage.name;
    });
}
export { getPageSetter, paginateBook };
