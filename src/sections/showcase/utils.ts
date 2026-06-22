// Where the source card currently sits on screen, expressed as the transform
// that would shrink the fullscreen panel onto it. The card lives inside the
// pinned horizontal track, so getBoundingClientRect already accounts for its
// slide.
export function cardScale(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left,
    y: r.top,
    scaleX: r.width / globalThis.innerWidth,
    scaleY: r.height / globalThis.innerHeight,
  };
}
