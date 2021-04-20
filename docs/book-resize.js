const mobileMaxScreenWidth = 799;
const bookDefaultWidth = 1050;
const bookDefaultHeight = 840;
const bookMinWidth = 320;
const proportions = bookDefaultHeight / bookDefaultWidth;
const bookMinHeight = bookMinWidth * proportions;
const rootStyle = document.documentElement.style;
function getBookSize(maxWidth, maxHeight) {
    let width = Math.max(bookMinWidth, bookDefaultWidth);
    let ratio = proportions;
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
    console.log({ width, height });
    return { width, height };
}
function refreshBookSize() {
    const { width, height } = getBookSize(window.innerWidth, window.innerHeight);
    rootStyle.setProperty('--book-height', `${Math.floor(height)}px`);
    rootStyle.setProperty('--book-width', `${Math.floor(width)}px`);
}
export { refreshBookSize };
