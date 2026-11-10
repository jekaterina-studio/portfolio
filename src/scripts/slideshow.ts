// Manual slideshow: native horizontal scroll with snap (swipe works without JS);
// this adds previous/next buttons and the counter. No autoplay.
document.querySelectorAll<HTMLElement>('[data-slideshow]').forEach((root) => {
  const track = root.querySelector<HTMLElement>('.slideshow__track')!;
  const slides = Array.from(track.children) as HTMLElement[];
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const current = root.querySelector<HTMLElement>('[data-current]')!;
  let index = 0;

  const update = () => {
    current.textContent = String(index + 1);
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    slides.forEach((s, i) => s.toggleAttribute('inert', i !== index));
  };
  const go = (i: number) => {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    update();
  };

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });

  let t: number | undefined;
  track.addEventListener('scroll', () => {
    clearTimeout(t);
    t = window.setTimeout(() => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== index) { index = i; update(); }
    }, 80);
  });

  root.classList.add('is-enhanced');
  update();
});
