const throttle = (function () {
    let timerId;
    return (func, delay) => {
        if (timerId) {
            return;
        }
        timerId = setTimeout(() => {
            func();
            timerId = undefined;
        }, delay);
    };
})();
export { throttle };
