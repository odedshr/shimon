var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const minBookWidth = 800;
function addPageNumber(pages) {
    pages.forEach(page => page.pageElm.setAttribute('data-page-number', `${page.id + 1}`));
}
const throttle = (function () {
    let timerId;
    return (func, delay) => {
        if (timerId) {
            return;
        }
        timerId = setTimeout(() => {
            func();
            timerId = undefined;
        }, delay);
    };
})();
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
function getPageSetter(pages, tocBtn, prevBtn, nextBtn) {
    prevBtn.addEventListener('click', evt => preventDefaultAndThrottle(updateHashTag.bind({}, prevBtn.getAttribute('href') || '#'), evt));
    nextBtn.addEventListener('click', evt => preventDefaultAndThrottle(updateHashTag.bind({}, nextBtn.getAttribute('href') || '#'), evt));
    return (page) => __awaiter(this, void 0, void 0, function* () {
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
export { addPageNumber, getPageSetter };
