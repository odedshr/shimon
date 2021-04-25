let timeout;
export function debounce(func, wait) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        timeout = undefined;
        console.log('calling');
        func();
    }, wait);
}
;
