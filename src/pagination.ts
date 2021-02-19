import { Page } from './Page.js';

const minBookWidth = 800;

function addPageNumber(pages: Page[]) {
  pages.forEach(page => page.pageElm.setAttribute('data-page-number', `${page.id + 1}`))
}

const throttle = (function () {
  let timerId: number | undefined;

  return (func: Function, delay: number) => {
    // If setTimeout is already scheduled, no need to do anything
    if (timerId) {
      return
    }

    // Schedule a setTimeout after delay seconds
    timerId = setTimeout(() => {
      func();
      timerId = undefined;
    }, delay)
  }
})();

function getCurrentPage(pages: Page[]): Page {
  const pageElm = document.querySelector('[data-page="current"]');
  return pages.find(page => (page.pageElm === pageElm)) || pages[0];
}

function getStepSize(currentPageIndex: number) {
  // if double-sided book AND current page is left side
  if (window.innerWidth > minBookWidth && !(currentPageIndex % 2)) {
    return 2;
  }

  return 1;
}

function setCurrentPage(pages: Page[], currentPage: Page, newCurrentIndex: number): Page {
  currentPage.pageElm.removeAttribute('data-page');

  // if double-sided book AND current page is right side, load set left side as current
  if (window.innerWidth > minBookWidth && (newCurrentIndex % 2)) {
    newCurrentIndex--;
  }

  const newCurrentPage = pages[newCurrentIndex];

  newCurrentPage.pageElm.setAttribute('data-page', 'current');
  location.hash = newCurrentPage.name;

  return newCurrentPage;
}

function animatePageFlip(setCurrentPage: () => Page, currentPage: Page, direction: 'backward' | 'forward') {
  (direction === 'backward') && (currentPage = setCurrentPage());
  currentPage.pageElm.setAttribute('data-anim', direction);

  setTimeout(() => {
    currentPage.pageElm.removeAttribute('data-anim');
    (direction === 'forward') && setCurrentPage();
  }, 500);
}

function onMoveBack(pages: Page[]) {
  const currentPage = getCurrentPage(pages);
  const currentPageIndex = currentPage.id;
  const stepSize = getStepSize(currentPageIndex);

  if (currentPageIndex - stepSize >= 0) {
    animatePageFlip(
      setCurrentPage.bind({}, pages, currentPage, currentPageIndex - stepSize),
      currentPage,
      'backward'
    );
  }
}

function onMoveForward(pages: Page[]) {
  const currentPage = getCurrentPage(pages);
  const currentPageIndex = currentPage.id;
  const stepSize = getStepSize(currentPageIndex);

  if (pages.length > currentPageIndex + stepSize) {
    animatePageFlip(
      setCurrentPage.bind({}, pages, currentPage, currentPageIndex + stepSize),
      currentPage,
      'forward'
    );
  }
}

function updateBackButton(btnElm: HTMLElement, pages: Page[], pageNumber: number) {
  if (pageNumber < 0) {
    btnElm.setAttribute('disabled', 'true');
    return;
  }

  btnElm.removeAttribute('disabled');
  btnElm.setAttribute('href', `#${pages[pageNumber].name}`);
}

function updateForwardButton(btnElm: HTMLElement, pages: Page[], pageNumber: number) {
  if (pageNumber > pages.length) {
    btnElm.setAttribute('disabled', 'true');
    return;
  }

  btnElm.removeAttribute('disabled');
  btnElm.setAttribute('href', `#${pages[pageNumber].name}`);
}

function preventDefaultAndThrottle(func: Function, evt: MouseEvent) {
  evt.preventDefault();
  throttle(func, 500);
  return false;
}
function getPageSetter(pages: Page[], backBtn?: HTMLElement, forwardBtn?: HTMLElement) {
  backBtn && backBtn.addEventListener('click', preventDefaultAndThrottle.bind({}, () => onMoveBack(pages)));
  forwardBtn && forwardBtn.addEventListener('click', preventDefaultAndThrottle.bind({}, () => onMoveForward(pages)));

  return (page: Page) => {
    const currentPage = getCurrentPage(pages);
    const pageNumber = page.id;
    const stepSize = getStepSize(pageNumber);

    setCurrentPage(pages, currentPage, pageNumber);

    backBtn && updateBackButton(backBtn, pages, pageNumber - stepSize);
    forwardBtn && updateForwardButton(forwardBtn, pages, pageNumber + stepSize);
  }
}

export { addPageNumber, getPageSetter }