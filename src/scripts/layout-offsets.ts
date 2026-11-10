// Writes the real heights of the fixed header and footer to CSS variables,
// so page padding always matches (the footer wraps to more lines on mobile).
const root = document.documentElement;

function measure() {
  const header = document.querySelector<HTMLElement>('[data-fixed-bar="header"]');
  const footer = document.querySelector<HTMLElement>('[data-fixed-bar="footer"]');
  if (header) root.style.setProperty('--header-h', `${header.offsetHeight}px`);
  if (footer) {
    const fixed = getComputedStyle(footer).position === 'fixed';
    root.style.setProperty('--footer-h', fixed ? `${footer.offsetHeight}px` : '0px');
  }
}

measure();
const ro = new ResizeObserver(measure);
document.querySelectorAll('[data-fixed-bar]').forEach((el) => ro.observe(el));
window.addEventListener('resize', measure);

// Mobile: keep the active navigation item visible in the scrollable nav row.
document.querySelector('.main-nav [aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
