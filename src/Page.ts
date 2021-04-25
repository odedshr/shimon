type Page = {
  pageElm: HTMLElement,
  pageContentElm: HTMLElement,
  id: number,
  slug: string;
  tocSlug?: string;
};

type PageMap = { [key: string]: Page };

class PageList extends Array<Page> {
  pageMap: PageMap = {};
  current?: Page;

  set(pages: PageList) {
    this.length = 0;
    for (let k in this.pageMap) {
      delete this.pageMap[k];
    }
    this.push(...pages);
    this.current = pages.current;
  }

  push(...items: Page[]) {
    const output = super.push(...items);
    items.forEach(page => {
      this.pageMap[page.slug] = page;

      if (page.tocSlug) {
        this.pageMap[page.tocSlug] = page;
      }
    });

    return output;
  }

  get(slug: string) {
    return this.pageMap[slug];
  }

  getCurrent() {
    return this.current;
  }

  setCurrent(page: Page) {
    (this.getCurrent())?.pageElm.removeAttribute('data-page');
    this.current = page;
    page.pageElm.setAttribute('data-page', 'current');
  }
}

export { Page, PageList };