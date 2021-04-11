function getAnchor(page) {
    const anchor = document.createElement('a');
    anchor.setAttribute('name', page.name);
    anchor.setAttribute('hidden', 'true');
    anchor.innerText = page.label;
    anchor.setAttribute('in-toc', `${page.inToc}`);
    return anchor;
}
function addAnchor(page) {
    page.pageElm.prepend(getAnchor(page));
}
function getTOCLink(page) {
    const link = document.createElement('a');
    link.setAttribute('href', `#${page.name}`);
    link.setAttribute('date-page', `${page.id + 1}`);
    link.classList.add(`tocItem_level-${page.level}`);
    link.classList.add(`toc_item`);
    link.innerText = page.label.toLocaleLowerCase();
    return link;
}
function addToTOC(tocElm, page) {
    tocElm.appendChild(getTOCLink(page));
}
function initTableOfContents(pages, tocElm) {
    pages.forEach(addAnchor);
    pages
        .filter(page => page.inToc)
        .forEach(page => addToTOC(tocElm, page));
}
export { initTableOfContents };
