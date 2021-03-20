import { Page } from './Page.js';

type PageMap = { [key: string]: Page };

function getHashChangeHandler(pages: Page[], setPage: (page: Page) => void) {
  const pageMap: PageMap = pages.reduce((map: PageMap, page) => { map[page.name] = page; return map; }, {});

  return () => {
    const page = pageMap[location.hash.substr(1)] || pages[0];
    console.log('hash changed', page);
    if (page) {
      setPage(page);
    }
  }
}

export { getHashChangeHandler }