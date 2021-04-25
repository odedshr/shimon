import { PageList } from './Page.js';

type TOCLink = {
  url: string;
  elm: HTMLElement;
}

type TOCLinkMap = { [url: string]: TOCLink }

class TOCLinks extends Array<TOCLink> {
  linkMap: TOCLinkMap = {};

  push(...items: TOCLink[]) {
    const output = super.push(...items);
    items.forEach(link => {
      this.linkMap[link.url] = link;
    });

    return output;
  }

  get(url: string) {
    return this.linkMap[url];
  }
}

function clearTOCLinksPageNumbers() {
  Array.from(document.querySelectorAll('.toc_item')).forEach(link => link.setAttribute('date-page', ''));
}

function appendTOCLinks(tocHeader: HTMLElement, tocLinks: TOCLinks) {
  const tocHeaderParent = tocHeader.parentElement;
  const tocHeaderSibling = tocHeader.nextSibling;

  tocLinks.forEach(tocLink => tocHeaderParent?.insertBefore(tocLink.elm, tocHeaderSibling));
}


function getTOCLinks(headers: HTMLElement[]): TOCLinks {
  const output = new TOCLinks();

  headers.forEach(header => {
    const level = (+header.nodeName.replace(/\D/g, '')) - 1;
    const elm = document.createElement('a');
    const url = header.getAttribute('name')?.trim() || '';

    elm.classList.add(`tocItem_level-${level}`);
    elm.classList.add(`toc_item`);
    elm.setAttribute('href', `#${url}`);
    elm.innerText = header.innerText.toLocaleLowerCase();

    output.push({ url, elm });
  });

  return output;
}

function initHeaders() {
  return Array.from(document.querySelectorAll('.page h2:not([not-in-toc]), .page h3:not([not-in-toc])'))
    .map(header => {
      const name = (header as HTMLElement).innerText
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/[^A-Za-z0-9\-]/g, '');

      const anchor = document.createElement('a');
      anchor.setAttribute('name', name);
      header.setAttribute('name', name);
      header.prepend(anchor);

      return header as HTMLElement;
    });
}

function refreshTOCLinks(tocLinks: TOCLinks, pages: PageList) {
  tocLinks.forEach(tocLink => {
    const page = pages.get(tocLink.url);
    if (page) {
      tocLink.elm.setAttribute('date-page', `${page.id + 1}`);
    } else {
      tocLink.elm.removeAttribute('date-page');
    }
  });
}

export { TOCLinks, getTOCLinks, appendTOCLinks, initHeaders, refreshTOCLinks, clearTOCLinksPageNumbers };