const formatTime = (t) => {
  const secNum = parseInt(t, 10); // don't forget the second param
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - (hours * 3600)) / 60);
  let seconds = secNum - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = `0${hours}`; }
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }
  return `${minutes}:${seconds}`;
};

const generateUUID = () => {
  let d = new Date().getTime();
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r)%16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r)%16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & (0x3 | 0x8))).toString(16);
  });
};

const isInstalled = () => {
  if (typeof window !== 'undefined') {
    return !('standalone' in window.navigator) && !(window.navigator.standalone);
  }
};

export {
  formatTime, generateUUID, isInstalled,
};
