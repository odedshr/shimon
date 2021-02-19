import { Page } from './Page.js';

function getAnchor(page: Page) {
  const anchor = document.createElement('a');
  anchor.setAttribute('name', page.name);
  anchor.setAttribute('hidden', 'true');
  anchor.innerText = page.label;
  anchor.setAttribute('in-toc', `${page.inToc}`);

  return anchor;
}

function addAnchor(page: Page) {
  page.pageElm.prepend(getAnchor(page));
}

function getTOCLink(page: Page) {
  const link = document.createElement('a');

  link.setAttribute('href', `#${page.name}`);
  link.setAttribute('date-page', `${page.id + 1}`);
  link.classList.add(`tocItem_level-${page.level}`);
  link.classList.add(`toc_item`);
  link.innerText = page.label;

  return link;
}

function addToTOC(tocElm: HTMLElement, page: Page) {
  tocElm.appendChild(getTOCLink(page));
}

function initTableOfContents(pages: Page[], tocElm: HTMLElement) {
  pages.forEach(addAnchor);
  pages
    .filter(page => page.inToc)
    .forEach(page => addToTOC(tocElm, page));
}

export { initTableOfContents };