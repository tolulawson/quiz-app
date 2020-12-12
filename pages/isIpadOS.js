export function isIpadOS() {
  if (process.env.browser) {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

    return navigator.maxTouchPoints
      && navigator.maxTouchPoints > 2
      && /MacIntel/.test(navigator.platform) && iOSSafari;
  }
}
