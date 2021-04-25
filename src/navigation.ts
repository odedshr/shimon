import { Page, PageList } from './Page.js';
import { updateLocation } from './hash-parser.js';
import { throttle } from './throttle.js';

const minBookWidth = 800;

function getCurrentPage(pages: PageList): Page {
  const pageElm = pages.getCurrent()?.pageElm;
  return pages.get(pageElm?.getAttribute('name') || '') || pages[0];
}

function isDoubleSided() {
  return window.innerWidth > minBookWidth
}

function getStepSize(currentPageIndex: number) {
  // if double-sided book AND current page is left side
  if (isDoubleSided() && !(currentPageIndex % 2)) {
    return 2;
  }

  return 1;
}

function getPagePositionDescription(index: number, pageCount: number) {
  return index === 0 ? 'first' : index === (pageCount - getStepSize(index)) ? 'last' : undefined;
}

function updatePagePositionDescription(index: number, pageCount: number) {
  const pagePosition = getPagePositionDescription(index, pageCount);

  if (pagePosition) {
    document.body.setAttribute('data-page', pagePosition);
  } else {
    document.body.removeAttribute('data-page');
  }
}

function setCurrentPage(pages: PageList, newCurrentIndex: number): Page {
  // if double-sided book AND current page is right side, load set left side as current
  if (window.innerWidth > minBookWidth && (newCurrentIndex % 2)) {
    newCurrentIndex--;
  }

  const newCurrentPage = pages[newCurrentIndex];

  if (newCurrentPage) {
    pages.setCurrent(newCurrentPage);

    updatePagePositionDescription(newCurrentIndex, pages.length)
  }

  return newCurrentPage;
}

function animatePageFlip(setCurrentPage: () => Page, currentPage: Page, isStepForward: boolean): Promise<Page> {
  return new Promise(resolve => {
    !isStepForward && (currentPage = setCurrentPage());
    currentPage.pageElm.setAttribute('data-anim', isStepForward ? 'forward' : 'backward');

    setTimeout(() => {
      currentPage.pageElm.removeAttribute('data-anim');
      isStepForward && setCurrentPage();
      resolve(currentPage);
    }, 500);
  })
}

function getPageSetter() {
  return async (pages: PageList, page: Page) => {
    if (!page) {
      return;
    }

    let currentPage = getCurrentPage(pages);
    const pageNumber = page.id;
    const stepSize = getStepSize(pageNumber);
    const step = pageNumber < currentPage.id ? -stepSize : stepSize;

    if (currentPage.id !== page.id) {
      await animatePageFlip(() => (currentPage = setCurrentPage(pages, pageNumber)), currentPage, step > 0);
    }
  }
}

function getTargetPageSlug(pages: PageList, direction: 1 | -1) {

  const page = getCurrentPage(pages);
  const pageNumber = page.id;
  const stepSize = direction * getStepSize(pageNumber);
  const targetPage = pages[Math.min(Math.max(0, pageNumber + stepSize), pages.length - 1)];

  return targetPage.tocSlug || targetPage.slug;
}

function preventDefaultAndThrottle(func: Function, evt: MouseEvent) {
  evt.preventDefault();
  throttle(func.bind(evt.target, evt), 500);
  return false;
}

function initNavButtons(pages: PageList, prevBtn: HTMLElement, nextBtn: HTMLElement) {
  prevBtn.addEventListener('click', evt => preventDefaultAndThrottle(() => updateLocation(getTargetPageSlug(pages, -1)), evt));
  nextBtn.addEventListener('click', evt => preventDefaultAndThrottle(() => updateLocation(getTargetPageSlug(pages, 1)), evt));
}

export { initNavButtons, updatePagePositionDescription, getCurrentPage, getPageSetter }