const rootStyle = document.documentElement.style;
const delta = 1000;
function getResizeHandler() {
    let rTime = 0;
    let timeout = false;
    const resizeEnd = () => {
        if ((new Date()).getTime() - rTime < delta) {
            setTimeout(resizeEnd, delta);
        }
        else {
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
    };
}
export { getResizeHandler };
