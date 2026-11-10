// Red-to-colour interaction.
// - Mouse: handled purely in CSS with :hover (no click state).
// - Touch and keyboard: a tap / Enter / Space toggles aria-pressed,
//   which switches between red-tinted and original colours.
let lastPointer = '';
document.addEventListener('pointerdown', (e) => { lastPointer = e.pointerType; }, true);
document.addEventListener('keydown', () => { lastPointer = 'keyboard'; }, true);

document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLButtonElement>('.doc-image__toggle');
  if (!btn) return;
  if (lastPointer === 'mouse') return; // hover already reveals the colours
  btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
});
