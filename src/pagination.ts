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

  if (newCurrentPage) {
    newCurrentPage.pageElm.setAttribute('data-page', 'current');
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

function updateHashTag(newPageHash: string) {
  location.hash = newPageHash.substr(1);
}

// function onMoveBack(pages: Page[], newPageHash: string) {
//   const currentPage = getCurrentPage(pages);
//   const currentPageIndex = currentPage.id;
//   const stepSize = getStepSize(currentPageIndex);

//   if (currentPageIndex - stepSize >= 0) {
//     animatePageFlip(
//       setCurrentPage.bind({}, pages, currentPage, currentPageIndex - stepSize),
//       currentPage,
//       'backward'
//     );
//   }
// }

// function onMoveForward(pages: Page[]) {
//   const currentPage = getCurrentPage(pages);
//   const currentPageIndex = currentPage.id;
//   const stepSize = getStepSize(currentPageIndex);

//   if (pages.length > currentPageIndex + stepSize) {
//     animatePageFlip(
//       setCurrentPage.bind({}, pages, currentPage, currentPageIndex + stepSize),
//       currentPage,
//       'forward'
//     );
//   }
// }

function updateNavButton(btnElm: HTMLElement, pageNumber: number) {
  if (pageNumber < 0) {
    btnElm.setAttribute('disabled', 'true');
    return;
  }

  btnElm.removeAttribute('disabled');
}

function updatePreviousButton(btnElm: HTMLElement, pages: Page[], pageNumber: number) {
  updateNavButton(btnElm, pageNumber);
  (pageNumber >= 0) && btnElm.setAttribute('href', `#${pages[pageNumber].name}`);
}

function updateNextButton(btnElm: HTMLElement, pages: Page[], pageNumber: number) {
  if (pageNumber >= pages.length) {
    btnElm.setAttribute('disabled', 'true');
    return;
  }

  btnElm.removeAttribute('disabled');
  btnElm.setAttribute('href', `#${pages[pageNumber].name}`);
}

function preventDefaultAndThrottle(func: Function, evt: MouseEvent) {
  evt.preventDefault();
  throttle(func.bind(evt.target, evt), 500);
  return false;
}

// function getFlipPageRange(start: number, end: number, step: number) {
//   const len = Math.floor((Math.abs(end - start)) / step) + 1;

//   return Array(len).fill(0).map((_, idx) => start + (idx * step))
// }

function getPageSetter(pages: Page[], tocBtn: HTMLElement, prevBtn: HTMLElement, nextBtn: HTMLElement,) {
  prevBtn.addEventListener('click', evt => preventDefaultAndThrottle(updateHashTag.bind({}, prevBtn.getAttribute('href') || '#'), evt));
  nextBtn.addEventListener('click', evt => preventDefaultAndThrottle(updateHashTag.bind({}, nextBtn.getAttribute('href') || '#'), evt));

  return async (page: Page) => {
    let currentPage = getCurrentPage(pages);
    const pageNumber = page.id;
    const stepSize = getStepSize(pageNumber);
    const step = pageNumber < currentPage.id ? -stepSize : stepSize;

    if (currentPage.id !== page.id) {
      await animatePageFlip(() => (currentPage = setCurrentPage(pages, currentPage, pageNumber)), currentPage, step > 0);
    }

    updateNavButton(tocBtn, pageNumber - stepSize);
    updatePreviousButton(prevBtn, pages, pageNumber - stepSize);
    updateNextButton(nextBtn, pages, pageNumber + stepSize);

    location.hash = currentPage.name;
  }
}

export { addPageNumber, getPageSetter }