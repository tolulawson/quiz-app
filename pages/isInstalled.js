export function isInstalled() {
  if (process.env.browser) {
    return window.matchMedia('(display-mode: standalone)').matches;
  }
}
