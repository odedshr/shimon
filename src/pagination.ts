import { PageList, Page } from './Page.js';

function getAnchor(pageId: string) {
  const anchor = document.createElement('a');
  anchor.classList.add('page-anchor');
  anchor.setAttribute('name', pageId);
  anchor.setAttribute('hidden', 'true');

  return anchor;
}

function getNewPage(id: number, tocSlug?: string): Page {
  const slug = `page-${id + 1}`;

  const pageElm = document.createElement('article');
  pageElm.classList.add('page');
  pageElm.setAttribute('name', slug);
  pageElm.appendChild(getAnchor(slug))

  const pageContentElm = document.createElement('section');
  pageContentElm.classList.add('page_content')
  pageElm.appendChild(pageContentElm);

  return { pageElm, pageContentElm, id, slug, tocSlug };
}

function addPage(pageList: PageList, bookElm: HTMLElement, headerSlug?: string) {
  const page = getNewPage(pageList.length, headerSlug);
  pageList.push(page);
  bookElm.appendChild(page.pageElm);

  return page;
}

function isMatch(page: Page, slug: string) {
  return page.slug === slug || page.tocSlug === slug;
}

function removeAllPages() {
  [...document.querySelectorAll('.page')].forEach(page => page.remove());
}

async function paginateBook(report: (status: number, page: Page) => void, currentPageId: string): Promise<PageList> {
  const bookElm: HTMLElement = document.querySelector('.book') || document.createElement('div');
  const pageList = new PageList();
  const items = [...document.querySelectorAll('.page > *:not(.page-anchor)')];
  const itemCount = items.length - 1;

  removeAllPages();

  let page = addPage(pageList, bookElm, undefined);
  let section = page.pageContentElm;
  const maxHeight = section.offsetHeight;
  let i = 0;

  const addNextItem = (resolve: (value: PageList | PromiseLike<PageList>) => void) => setTimeout(() => {
    const item = items[i] as HTMLElement;
    const itemIsHeader = (item.nodeName[0] === 'H' && section.children.length > 0)

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
      addNextItem(resolve)
    } else {
      // book has uneven number of pages, we'll need one more page to pair with the last page
      if (pageList.length % 2) {
        addPage(pageList, bookElm);
      }

      resolve(pageList);
    }
  }, 0);

  return new Promise(addNextItem);
}

export { paginateBook }