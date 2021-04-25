const throttle = (function () {
  let timerId: number | undefined;

  return (func: Function, delay: number) => {
    // If setTimeout is already scheduled, no need to do anything
    if (timerId) {
      return
    }

    // Schedule a setTimeout after delay seconds
    timerId = setTimeout(() => {
      func();
      timerId = undefined;
    }, delay)
  }
})();

export { throttle };