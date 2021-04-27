var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { updateLocation } from './hash-parser.js';
import { throttle } from './throttle.js';
const minBookWidth = 800;
function isDoubleSided() {
    return window.innerWidth > minBookWidth;
}
function getStepSize(currentPageIndex) {
    if (isDoubleSided() && !(currentPageIndex % 2)) {
        return 2;
    }
    return 1;
}
function getPagePositionDescription(index, pageCount) {
    return index === 0 ? 'first' : index === (pageCount - getStepSize(index)) ? 'last' : undefined;
}
function updatePagePositionDescription(index, pageCount) {
    const pagePosition = getPagePositionDescription(index, pageCount);
    if (pagePosition) {
        document.body.setAttribute('data-page', pagePosition);
    }
    else {
        document.body.removeAttribute('data-page');
    }
}
function setCurrentPage(pages, newCurrentIndex) {
    if (window.innerWidth > minBookWidth && (newCurrentIndex % 2)) {
        newCurrentIndex--;
    }
    const newCurrentPage = pages[newCurrentIndex];
    if (newCurrentPage) {
        pages.setCurrent(newCurrentPage);
        updatePagePositionDescription(newCurrentIndex, pages.length);
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
function getPageSetter() {
    return (pages, page) => __awaiter(this, void 0, void 0, function* () {
        if (!page) {
            return;
        }
        let currentPage = pages.getCurrent() || pages[0];
        const pageNumber = page.id;
        const stepSize = getStepSize(pageNumber);
        const step = pageNumber < currentPage.id ? -stepSize : stepSize;
        if (currentPage.id !== page.id) {
            yield animatePageFlip(() => (currentPage = setCurrentPage(pages, pageNumber)), currentPage, step > 0);
        }
    });
}
function getTargetPageSlug(pages, direction) {
    const page = pages.getCurrent() || pages[0];
    const pageNumber = page.id;
    const stepSize = direction * getStepSize(pageNumber);
    const targetPage = pages[Math.min(Math.max(0, pageNumber + stepSize), pages.length - 1)];
    return targetPage.tocSlug || targetPage.slug;
}
function preventDefaultAndThrottle(func, evt) {
    evt.preventDefault();
    throttle(func.bind(evt.target, evt), 500);
    return false;
}
function initNavButtons(pages, prevBtn, nextBtn) {
    prevBtn.addEventListener('click', evt => preventDefaultAndThrottle(() => updateLocation(getTargetPageSlug(pages, -1)), evt));
    nextBtn.addEventListener('click', evt => preventDefaultAndThrottle(() => updateLocation(getTargetPageSlug(pages, 1)), evt));
}
export { isDoubleSided, initNavButtons, updatePagePositionDescription, getPageSetter };
