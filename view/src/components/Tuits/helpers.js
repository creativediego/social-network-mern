export const setClassWithTimeout = (setState, className) => {
  setState(className);
  setTimeout(() => {
    setState('');
  }, 400);
};
