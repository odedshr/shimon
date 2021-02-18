(function () {
  const headerMap = {};

  function updateHeaderMap(headers) {
    headers.forEach(function (item) {
      headerMap[item.href] = item.page;
    });
  }

  function parseHeader(pages, hElm) {
    return {
      page: pages.indexOf(hElm.parentElement),
      href: hElm.firstChild.name,
      label: hElm.innerText,
      level: (+hElm.nodeName.replace(/\D/g, '')) - 1
    };
  }

  function addToTOC(tocElm, item) {
    const link = document.createElement('a');
    link.setAttribute('href', `#${item.href}`);
    link.setAttribute('date-page', item.page + 1);
    link.innerText = item.label;
    link.classList.add(`tocItem_level-${item.level}`);
    link.classList.add(`toc_item`);
    tocElm.appendChild(link)
  }

  function onload() {
    const pages = [...document.querySelector('.book').children];
    const tocElm = document.querySelector('.book_toc');
    const headers = [...document.querySelectorAll('h2:not([is-toc]), h3')]
      .map(parseHeader.bind({}, pages));

    headers.forEach(addToTOC.bind({}, tocElm));
    updateHeaderMap(headers);

    navToHash();
  }

  function navToHash() {
    const pageNumber = headerMap[location.hash.substr(1)];
    if (pageNumber) {
      setPage(pageNumber);
    }
  }

  window.addEventListener('load', onload);
  window.addEventListener('hashchange', navToHash);
})();