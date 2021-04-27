import { PageList, Page } from './Page.js';
import { isDoubleSided } from './navigation.js';

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
  pageElm.appendChild(getAnchor(slug));

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

async function paginateBook(report: (status: number) => void, currentPageId: string): Promise<PageList> {
  const bookElm: HTMLElement = document.querySelector('.book') || document.createElement('div');
  const pageList = new PageList();
  const items = [...document.querySelectorAll('.page_content > *:not(.page-anchor)')];
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
        // if double-sided and current page is right-side
        pageList.setCurrent((isDoubleSided() && !(pageList.length % 2)) ? pageList[pageList.length - 2] : page);
        report(-1);
      }

      page = addPage(pageList, bookElm, item.getAttribute('name') || undefined);
      section = page.pageContentElm;
      section.appendChild(item);
    }

    report(i / itemCount);

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

// getPages() is used to load the initial page structure, without rebuilding the entire book;
// it applies when the window size is bigger than book.maxSize;
function getPages(currentPageId: string) {
  const pages = new PageList();

  [...document.querySelectorAll('.page')].forEach((pageElm, id) => {
    let pageContentElm = (pageElm.querySelector('.page_content') || document.createElement('section')) as HTMLElement;
    const slug = `page-${id + 1}`;
    const tocSlug = pageElm.querySelector('h2, h3')?.getAttribute('name') || undefined;

    pageElm.setAttribute('name', slug);
    pageElm.appendChild(getAnchor(slug));

    if (!pageContentElm.classList.length) {
      pageContentElm.classList.add('page_content')
      pageElm.appendChild(pageContentElm);
    }

    const page: Page = {
      pageElm: pageElm as HTMLElement,
      pageContentElm,
      id,
      slug,
      tocSlug
    }
    pages.push(page);


    if (isMatch(page, currentPageId)) {
      // if double-sided and current page is right-side
      pages.setCurrent((isDoubleSided() && !(pages.length % 2)) ? pages[pages.length - 2] : page);
    }

    return page;
  })
  return pages;
}

export { paginateBook, getPages }