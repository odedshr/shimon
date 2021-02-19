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
    newCurrentPage.pageElm.setAttribute('data-page', 'current');
    location.hash = newCurrentPage.name;
    return newCurrentPage;
}
function animatePageFlip(setCurrentPage, currentPage, direction) {
    (direction === 'backward') && (currentPage = setCurrentPage());
    currentPage.pageElm.setAttribute('data-anim', direction);
    setTimeout(() => {
        currentPage.pageElm.removeAttribute('data-anim');
        (direction === 'forward') && setCurrentPage();
    }, 500);
}
function onMoveBack(pages) {
    const currentPage = getCurrentPage(pages);
    const currentPageIndex = currentPage.id;
    const stepSize = getStepSize(currentPageIndex);
    if (currentPageIndex - stepSize >= 0) {
        animatePageFlip(setCurrentPage.bind({}, pages, currentPage, currentPageIndex - stepSize), currentPage, 'backward');
    }
}
function onMoveForward(pages) {
    const currentPage = getCurrentPage(pages);
    const currentPageIndex = currentPage.id;
    const stepSize = getStepSize(currentPageIndex);
    if (pages.length > currentPageIndex + stepSize) {
        animatePageFlip(setCurrentPage.bind({}, pages, currentPage, currentPageIndex + stepSize), currentPage, 'forward');
    }
}
function updateBackButton(btnElm, pages, pageNumber) {
    if (pageNumber < 0) {
        btnElm.setAttribute('disabled', 'true');
        return;
    }
    btnElm.removeAttribute('disabled');
    btnElm.setAttribute('href', `#${pages[pageNumber].name}`);
}
function updateForwardButton(btnElm, pages, pageNumber) {
    if (pageNumber > pages.length) {
        btnElm.setAttribute('disabled', 'true');
        return;
    }
    btnElm.removeAttribute('disabled');
    btnElm.setAttribute('href', `#${pages[pageNumber].name}`);
}
function preventDefaultAndThrottle(func, evt) {
    evt.preventDefault();
    throttle(func, 500);
    return false;
}
function getPageSetter(pages, backBtn, forwardBtn) {
    backBtn && backBtn.addEventListener('click', preventDefaultAndThrottle.bind({}, () => onMoveBack(pages)));
    forwardBtn && forwardBtn.addEventListener('click', preventDefaultAndThrottle.bind({}, () => onMoveForward(pages)));
    return (page) => {
        const currentPage = getCurrentPage(pages);
        const pageNumber = page.id;
        const stepSize = getStepSize(pageNumber);
        setCurrentPage(pages, currentPage, pageNumber);
        backBtn && updateBackButton(backBtn, pages, pageNumber - stepSize);
        forwardBtn && updateForwardButton(forwardBtn, pages, pageNumber + stepSize);
    };
}
export { addPageNumber, getPageSetter };
