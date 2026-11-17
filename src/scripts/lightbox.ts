// Lightbox: clicking a gallery image opens it enlarged in a <dialog>.
// Previous/next buttons and arrow keys move within the same gallery;
// Esc, the close button or a click outside the image closes it.
const galleries = document.querySelectorAll<HTMLElement>('[data-lightbox]');
if (galleries.length) {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML = `
    <figure class="lightbox__figure"><img class="lightbox__img" alt=""><figcaption class="lightbox__caption" hidden></figcaption></figure>
    <div class="lightbox__bar">
      <button type="button" class="lightbox__btn" data-lb-prev></button>
      <span class="lightbox__count" aria-live="polite"></span>
      <button type="button" class="lightbox__btn" data-lb-next></button>
      <button type="button" class="lightbox__btn lightbox__close" data-lb-close></button>
    </div>`;
  document.body.append(dialog);
  const img = dialog.querySelector<HTMLImageElement>('.lightbox__img')!;
  const count = dialog.querySelector<HTMLElement>('.lightbox__count')!;
  const caption = dialog.querySelector<HTMLElement>('.lightbox__caption')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lb-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lb-next]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-lb-close]')!;
  let items: HTMLButtonElement[] = [];
  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (i: number) => {
    index = Math.max(0, Math.min(items.length - 1, i));
    const btn = items[index];
    img.src = btn.dataset.zoom!;
    img.alt = btn.querySelector('img')?.alt ?? '';
    // optional credit shown only here (data-caption), e.g. photo credits
    caption.textContent = btn.dataset.caption ?? '';
    caption.hidden = !btn.dataset.caption;
    count.textContent = `${index + 1} / ${items.length}`;
    prev.disabled = index === 0;
    next.disabled = index === items.length - 1;
    const single = items.length < 2;
    prev.hidden = next.hidden = count.hidden = single;
  };

  galleries.forEach((g) => {
    const buttons = Array.from(g.querySelectorAll<HTMLButtonElement>('[data-zoom]'));
    buttons.forEach((b, i) => b.addEventListener('click', () => {
      items = buttons;
      prev.textContent = g.dataset.labelPrev ?? 'previous';
      next.textContent = g.dataset.labelNext ?? 'next';
      close.textContent = g.dataset.labelClose ?? 'close';
      opener = b;
      show(i);
      dialog.showModal();
      document.documentElement.classList.add('has-lightbox');
    }));
  });

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target === dialog.querySelector('.lightbox__figure')) dialog.close(); });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('has-lightbox');
    img.removeAttribute('src');
    opener?.focus();
  });
}
