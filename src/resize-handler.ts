const rootStyle = document.documentElement.style;
const delta = 1000;

function getResizeHandler() {
  let rTime: number = 0;
  let timeout = false;

  const resizeEnd = () => {
    if ((new Date()).getTime() - rTime < delta) {
      setTimeout(resizeEnd, delta);
    } else {
      timeout = false;
      document.body.setAttribute('data-state', 'idle');
      window.dispatchEvent(new Event('resize-end'));
    }
  };

  return () => {
    rootStyle.setProperty('--window-height', `${window.innerHeight}`);
    rootStyle.setProperty('--window-width', `${window.innerWidth}`);
    rTime = (new Date()).getTime();
    if (timeout === false) {
      document.body.setAttribute('data-state', 'resizing');
      timeout = true;
      setTimeout(resizeEnd, delta);
    }
  }
}

//

type BookSize = { width: number, height: number };
const maxBookSize: BookSize = { width: 1050, height: 850 };
let lastBookSize: BookSize = getCurrentBookSize();

function getCurrentBookSize() {
  return { width: window.innerWidth, height: window.innerHeight };
}

function isBookBiggerOrEqual(bookA: BookSize, bookB: BookSize) {
  return (bookA.width >= bookB.width) && (bookA.height >= bookB.height);
}

function isResizingRequired() {
  const bookSize = getCurrentBookSize();
  const isRequired = isBookBiggerOrEqual(bookSize, maxBookSize) && isBookBiggerOrEqual(lastBookSize, maxBookSize);
  lastBookSize = bookSize;
  return !isRequired;
}

export { getResizeHandler, isResizingRequired };