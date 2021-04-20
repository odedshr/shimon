const mobileMaxScreenWidth = 799;
const bookDefaultWidth = 1050;
const bookDefaultHeight = 840;
const bookMinWidth = 320;
const proportions = bookDefaultHeight / bookDefaultWidth;
const bookMinHeight = bookMinWidth * proportions;
const rootStyle = document.documentElement.style;

function getBookSize(maxWidth: number, maxHeight: number) {
  let width = Math.max(bookMinWidth, bookDefaultWidth);
  let ratio = proportions;

  // if (maxWidth <= mobileMaxScreenWidth) {
  //   bookWidth /= 2;
  //   ratio *= 2;
  // }

  let height = Math.max(bookMinHeight, width * ratio);

  if (width > maxWidth) {
    ratio = maxWidth / width;
    height *= ratio;
    width *= ratio;
  }

  if (height > maxHeight) {
    ratio = maxHeight / height;
    width *= ratio;
    height *= ratio;
  }

  return { width, height };
}

function refreshBookSize() {
  const { width, height } = getBookSize(window.innerWidth, window.innerHeight);

  rootStyle.setProperty('--book-height', `${Math.floor(height)}px`);
  rootStyle.setProperty('--book-width', `${Math.floor(width)}px`);
}

export { refreshBookSize };