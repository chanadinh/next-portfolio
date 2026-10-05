// Shared by the React island and the portable preview. Content is visible until
// this enhancement is mounted; native links, details, and skill radios stand alone.
export function mountPortfolioMotion(root: HTMLElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const toggles = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]'));
  const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  const zones = Array.from(root.querySelectorAll<HTMLElement>('[data-motion-zone]'));
  const progress = root.querySelector<HTMLElement>('[data-scroll-progress]');
  let paused = false;
  try { paused = localStorage.getItem('portfolio-motion-paused') === 'true'; } catch { /* Storage is optional. */ }
  let running = false;
  let frame = 0;
  let tiltTarget: HTMLElement | null = null;
  let pointer: { x: number; y: number } | null = null;
  let revealObserver: IntersectionObserver | undefined;
  let zoneObserver: IntersectionObserver | undefined;

  function resetTilt() {
    if (tiltTarget) {
      ['--tilt-x', '--tilt-y', '--pointer-x', '--pointer-y'].forEach(name => tiltTarget!.style.removeProperty(name));
    }
    tiltTarget = null;
    pointer = null;
  }
  function draw() {
    frame = 0;
    if (!running || document.hidden) return;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress?.style.setProperty('--scroll-progress', String(distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0));
    if (tiltTarget && pointer) {
      const rect = tiltTarget.getBoundingClientRect();
      if (rect.width && rect.height) {
        const x = Math.min(1, Math.max(0, (pointer.x - rect.left) / rect.width));
        const y = Math.min(1, Math.max(0, (pointer.y - rect.top) / rect.height));
        tiltTarget.style.setProperty('--tilt-x', `${(0.5 - y) * 9}deg`);
        tiltTarget.style.setProperty('--tilt-y', `${(x - 0.5) * 9}deg`);
        tiltTarget.style.setProperty('--pointer-x', `${x * 100}%`);
        tiltTarget.style.setProperty('--pointer-y', `${y * 100}%`);
      }
    }
  }
  function schedule() { if (running && !document.hidden && !frame) frame = requestAnimationFrame(draw); }
  function sync() {
    running = !paused && !reduce.matches;
    root.dataset.motion = running ? 'running' : 'paused';
    root.dataset.motionVisible = String(!document.hidden);
    toggles.forEach(button => {
      button.hidden = false;
      button.disabled = reduce.matches;
      button.setAttribute('aria-pressed', String(!running));
      button.setAttribute('aria-label', reduce.matches ? 'Animations disabled by your reduced-motion preference' : running ? 'Pause animations' : 'Resume animations');
      const label = button.querySelector('[data-motion-label]');
      if (label) label.textContent = reduce.matches ? 'Motion off' : running ? 'Pause motion' : 'Play motion';
    });
    if (!running) {
      cancelAnimationFrame(frame); frame = 0; resetTilt();
      reveals.forEach(element => { element.dataset.revealState = 'seen'; });
      revealObserver?.disconnect();
    } else schedule();
  }
  function toggle() {
    if (reduce.matches) return;
    paused = !paused;
    try { localStorage.setItem('portfolio-motion-paused', String(paused)); } catch { /* Storage is optional. */ }
    sync();
  }
  function onPointer(event: PointerEvent) {
    if (!running || !finePointer.matches || event.pointerType === 'touch' || !(event.target instanceof Element)) return;
    const target = event.target.closest<HTMLElement>('[data-tilt]');
    if (target !== tiltTarget) { resetTilt(); tiltTarget = target; }
    if (target) { pointer = { x: event.clientX, y: event.clientY }; schedule(); }
  }
  function onFocus(event: FocusEvent) {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest<HTMLElement>('[data-reveal]');
    if (target) { target.dataset.revealState = 'seen'; revealObserver?.unobserve(target); }
  }

  sync();
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.revealState = 'seen';
        revealObserver?.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    reveals.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (running && rect.top >= window.innerHeight * 0.95) {
        element.dataset.revealState = 'pending';
        revealObserver!.observe(element);
      } else element.dataset.revealState = 'seen';
    });
    zoneObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting); });
    }, { rootMargin: '60px' });
    zones.forEach(element => zoneObserver!.observe(element));
  } else {
    reveals.forEach(element => { element.dataset.revealState = 'seen'; });
    zones.forEach(element => { element.dataset.inView = 'true'; });
  }

  toggles.forEach(button => button.addEventListener('click', toggle));
  reduce.addEventListener('change', sync);
  finePointer.addEventListener('change', resetTilt);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', sync);
  root.addEventListener('pointermove', onPointer, { passive: true });
  root.addEventListener('pointerleave', resetTilt);
  root.addEventListener('focusin', onFocus);
  return () => {
    cancelAnimationFrame(frame);
    revealObserver?.disconnect(); zoneObserver?.disconnect(); resetTilt();
    toggles.forEach(button => { button.removeEventListener('click', toggle); button.hidden = true; });
    reduce.removeEventListener('change', sync);
    finePointer.removeEventListener('change', resetTilt);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    document.removeEventListener('visibilitychange', sync);
    root.removeEventListener('pointermove', onPointer);
    root.removeEventListener('pointerleave', resetTilt);
    root.removeEventListener('focusin', onFocus);
    root.dataset.motion = 'paused';
    reveals.forEach(element => { delete element.dataset.revealState; });
  };
}
