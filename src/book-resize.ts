const mobileMaxScreenWidth = 799;
const bookDefaultWidth = 1050;
const bookDefaultHeight = 840;
const bookMinWidth = 320;
const proportions = bookDefaultHeight / bookDefaultWidth;
const bookMinHeight = bookMinWidth * proportions;

function refreshBookSize(bookElmStyle: CSSStyleDeclaration) {
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  let bookWidth = Math.max(bookMinWidth, bookDefaultWidth);
  let ratio = proportions;

  // if (maxWidth <= mobileMaxScreenWidth) {
  //   bookWidth /= 2;
  //   ratio *= 2;
  // }

  let bookHeight = Math.max(bookMinHeight, bookWidth * ratio);

  if (bookWidth > maxWidth) {
    ratio = maxWidth / bookWidth;
    bookHeight *= ratio;
    bookWidth *= ratio;
  }

  if (bookHeight > maxHeight) {
    ratio = maxHeight / bookHeight;
    bookWidth *= ratio;
    bookHeight *= ratio;
  }



  bookElmStyle.height = `${Math.floor(bookHeight)}px`;
  bookElmStyle.width = `${Math.floor(bookWidth)}px`;
}

export { refreshBookSize };