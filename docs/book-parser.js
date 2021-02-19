function parsePage(pageElm, id) {
    const header = pageElm.querySelector('h1,h2,h3');
    const name = header ? header.innerText
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/[^A-Za-z0-9\-]/g, '') : `page-${id + 1}`;
    const level = header ? (+header.nodeName.replace(/\D/g, '')) - 1 : -1;
    const label = header ? header.innerText : `Page ${id + 1}`;
    const inToc = header && header.tagName !== 'H1' && !header.getAttribute('not-in-toc') || false;
    return { name, pageElm, id, inToc, level, label };
}
function getPageIndex(pageQuery) {
    const pageElements = Array.from(document.querySelectorAll(pageQuery));
    return pageElements.map(parsePage);
}
export { getPageIndex };
