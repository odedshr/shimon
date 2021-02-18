const setPage = (function () {
  const minBookWidth = 800;
  const pages = [];

  function getStepSize(currentPageIndex) {
    if (window.innerWidth > minBookWidth && !(currentPageIndex % 2)) {
      return 2;
    }

    return 1;
  }

  function setCurrentPage(pages, currentPage, newCurrentIndex) {
    const newCurrentPage = pages[newCurrentIndex];
    newCurrentPage.setAttribute('data-page', 'current');
    currentPage.removeAttribute('data-page');
    return newCurrentPage;
  }

  function animatePageFlip(setCurrentPage, currentPage, direction) {
    (direction === 'backward') && (currentPage = setCurrentPage());
    currentPage.setAttribute('data-anim', direction);

    setTimeout(function () {
      currentPage.removeAttribute('data-anim');
      (direction === 'forward') && setCurrentPage();
    }, 500);
  }

  function onMoveBack(pages) {
    const currentPage = document.querySelector('[data-page="current"]');
    const currentPageIndex = [...pages].indexOf(currentPage)
    const stepSize = getStepSize(currentPageIndex);

    if (currentPageIndex - stepSize >= 0) {
      animatePageFlip(
        setCurrentPage.bind({}, pages, currentPage, currentPageIndex - stepSize),
        currentPage,
        'backward'
      );
    }
  }

  function onMoveNext(pages) {
    const currentPage = document.querySelector('[data-page="current"]');
    const currentPageIndex = [...pages].indexOf(currentPage)
    const stepSize = getStepSize(currentPageIndex);

    if (pages.length > currentPageIndex + stepSize) {
      animatePageFlip(
        setCurrentPage.bind({}, pages, currentPage, currentPageIndex + stepSize),
        currentPage,
        'forward'
      );
    }
  }

  function onload() {
    [...document.querySelector('.book').children]
      .forEach(function (page) { pages.push(page); });

    document
      .querySelector('.book_nav_backward')
      .addEventListener('click', onMoveBack.bind({}, pages));

    document
      .querySelector('.book_nav_forward')
      .addEventListener('click', onMoveNext.bind({}, pages));
  }

  window.addEventListener('load', onload);

  return function setPage(pageNumber) {
    const currentPage = document.querySelector('[data-page="current"]');
    setCurrentPage(pages, currentPage, pageNumber);
  }
})();