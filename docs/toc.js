class TOCLinks extends Array {
    constructor() {
        super(...arguments);
        this.linkMap = {};
    }
    push(...items) {
        const output = super.push(...items);
        items.forEach(link => {
            this.linkMap[link.url] = link;
        });
        return output;
    }
    get(url) {
        return this.linkMap[url];
    }
}
function clearTOCLinksPageNumbers() {
    Array.from(document.querySelectorAll('.toc_item')).forEach(link => link.setAttribute('date-page', ''));
}
function appendTOCLinks(tocHeader, tocLinks) {
    const tocHeaderParent = tocHeader.parentElement;
    const tocHeaderSibling = tocHeader.nextSibling;
    tocLinks.forEach(tocLink => tocHeaderParent === null || tocHeaderParent === void 0 ? void 0 : tocHeaderParent.insertBefore(tocLink.elm, tocHeaderSibling));
}
function getTOCLinks(headers) {
    const output = new TOCLinks();
    headers.forEach(header => {
        var _a;
        const level = (+header.nodeName.replace(/\D/g, '')) - 1;
        const elm = document.createElement('a');
        const url = ((_a = header.getAttribute('name')) === null || _a === void 0 ? void 0 : _a.trim()) || '';
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
        const name = header.innerText
            .toLowerCase()
            .replace(/\s/g, '-')
            .replace(/[^A-Za-z0-9\-]/g, '');
        const anchor = document.createElement('a');
        anchor.setAttribute('name', name);
        header.setAttribute('name', name);
        header.prepend(anchor);
        return header;
    });
}
function refreshTOCLinks(tocLinks, pages) {
    tocLinks.forEach(tocLink => {
        const page = pages.get(tocLink.url);
        if (page) {
            tocLink.elm.setAttribute('date-page', `${page.id + 1}`);
        }
        else {
            tocLink.elm.removeAttribute('date-page');
        }
    });
}
export { TOCLinks, getTOCLinks, appendTOCLinks, initHeaders, refreshTOCLinks, clearTOCLinksPageNumbers };
