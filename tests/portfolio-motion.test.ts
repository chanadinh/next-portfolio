import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { mountPortfolioMotion } from '../lib/portfolio-motion';

// Small event/observer harness for lifecycle and accessibility behavior, not layout.
class ElementStub extends EventTarget {
  dataset: Record<string, string> = {};
  attributes = new Map<string, string>();
  styles = new Map<string, string>();
  style = { setProperty: (key: string, value: string) => this.styles.set(key, value), removeProperty: (key: string) => this.styles.delete(key) };
  hidden = true;
  disabled = false;
  textContent = '';
  top = 0;
  queries: Record<string, ElementStub[]> = {};
  parent: ElementStub | null = null;
  querySelectorAll(selector: string) { return this.queries[selector] || []; }
  querySelector(selector: string) { return this.querySelectorAll(selector)[0] || null; }
  setAttribute(key: string, value: string) { this.attributes.set(key, value); }
  getBoundingClientRect() { return { top: this.top, left: 0, width: 200, height: 60 }; }
  closest() { return this.parent; }
}
class MediaStub extends EventTarget {
  constructor(public matches = false) { super(); }
  change(matches: boolean) { this.matches = matches; this.dispatchEvent(new Event('change')); }
}
class ObserverStub {
  static all: ObserverStub[] = [];
  watched = new Set<ElementStub>();
  disconnected = false;
  constructor(private callback: (entries: unknown[]) => void) { ObserverStub.all.push(this); }
  observe(element: ElementStub) { this.watched.add(element); }
  unobserve(element: ElementStub) { this.watched.delete(element); }
  disconnect() { this.disconnected = true; this.watched.clear(); }
  enter(element: ElementStub, isIntersecting = true) { this.callback([{ target: element, isIntersecting }]); }
}

const globals = ['window', 'document', 'Element', 'localStorage', 'IntersectionObserver', 'requestAnimationFrame', 'cancelAnimationFrame'] as const;
const original = new Map(globals.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
let cleanup: (() => void) | undefined;
afterEach(() => {
  cleanup?.(); cleanup = undefined;
  for (const key of globals) {
    const descriptor = original.get(key);
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});

function setup({ reduced = false, paused = false, observer = true } = {}) {
  ObserverStub.all = [];
  const root = new ElementStub(), button = new ElementStub(), label = new ElementStub(), progress = new ElementStub();
  const above = new ElementStub(), below = new ElementStub(), zone = new ElementStub();
  above.top = 100; below.top = 1000;
  button.queries['[data-motion-label]'] = [label];
  root.queries = { '[data-motion-toggle]': [button], '[data-reveal]': [above, below], '[data-motion-zone]': [zone], '[data-scroll-progress]': [progress] };
  const reduce = new MediaStub(reduced), fine = new MediaStub(true);
  const win = Object.assign(new EventTarget(), { innerHeight: 800, scrollY: 200, matchMedia: (query: string) => query.includes('reduced') ? reduce : fine, ...(observer ? { IntersectionObserver: ObserverStub } : {}) });
  const doc = Object.assign(new EventTarget(), { hidden: false, documentElement: { scrollHeight: 1600 } });
  const frames = new Map<number, () => void>(); let next = 0;
  const saved = new Map([['portfolio-motion-paused', String(paused)]]);
  const replacements: Record<string, unknown> = {
    window: win, document: doc, Element: ElementStub, IntersectionObserver: ObserverStub,
    localStorage: { getItem: (key: string) => saved.get(key), setItem: (key: string, value: string) => saved.set(key, value) },
    requestAnimationFrame: (callback: () => void) => { frames.set(++next, callback); return next; },
    cancelAnimationFrame: (id: number) => frames.delete(id),
  };
  for (const [key, value] of Object.entries(replacements)) Object.defineProperty(globalThis, key, { value, configurable: true });
  cleanup = mountPortfolioMotion(root as unknown as HTMLElement);
  return { root, button, label, progress, above, below, zone, reduce, win, doc, frames, saved };
}

test('reduced motion starts static and reacts to preference changes without hiding content', () => {
  const { root, button, label, below, reduce, frames } = setup({ reduced: true });
  assert.equal(root.dataset.motion, 'paused');
  assert.equal(button.disabled, true);
  assert.equal(label.textContent, 'Motion off');
  assert.equal(below.dataset.revealState, 'seen');
  assert.equal(frames.size, 0);
  reduce.change(false);
  assert.equal(root.dataset.motion, 'running');
  assert.equal(button.disabled, false);
  reduce.change(true);
  assert.equal(root.dataset.motion, 'paused');
  assert.equal(frames.size, 0);
});

test('pause is restored, persisted, and keeps all reading content visible', () => {
  const { root, button, label, below, saved } = setup({ paused: true });
  assert.equal(root.dataset.motion, 'paused');
  assert.equal(button.hidden, false);
  assert.equal(label.textContent, 'Play motion');
  button.dispatchEvent(new Event('click'));
  assert.equal(root.dataset.motion, 'running');
  assert.equal(saved.get('portfolio-motion-paused'), 'false');
  button.dispatchEvent(new Event('click'));
  assert.equal(root.dataset.motion, 'paused');
  assert.equal(below.dataset.revealState, 'seen');
  assert.equal(button.attributes.get('aria-pressed'), 'true');
  assert.equal(saved.get('portfolio-motion-paused'), 'true');
});

test('scroll entrances reveal once, keyboard focus reveals immediately, and offscreen loops are marked idle', () => {
  const { root, above, below, zone } = setup();
  const [reveals, zones] = ObserverStub.all;
  assert.equal(above.dataset.revealState, 'seen');
  assert.equal(below.dataset.revealState, 'pending');
  reveals.enter(below);
  assert.equal(below.dataset.revealState, 'seen');
  assert.equal(reveals.watched.has(below), false);
  below.dataset.revealState = 'pending';
  const link = new ElementStub(); link.parent = below;
  const focus = new Event('focusin'); Object.defineProperty(focus, 'target', { value: link });
  root.dispatchEvent(focus);
  assert.equal(below.dataset.revealState, 'seen');
  zones.enter(zone, false); assert.equal(zone.dataset.inView, 'false');
  zones.enter(zone, true); assert.equal(zone.dataset.inView, 'true');
});

test('scroll work is batched, background tabs are marked idle, and unmount removes observers and frames', () => {
  const { root, win, doc, frames, progress } = setup();
  for (let i = 0; i < 20; i++) win.dispatchEvent(new Event('scroll'));
  assert.equal(frames.size, 1);
  const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback());
  assert.equal(progress.styles.get('--scroll-progress'), '0.25');
  doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(root.dataset.motionVisible, 'false');
  win.dispatchEvent(new Event('scroll')); assert.equal(frames.size, 0);
  doc.hidden = false; doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(frames.size, 1);
  cleanup!(); cleanup = undefined;
  assert.equal(root.dataset.motion, 'paused');
  assert.equal(frames.size, 0);
  assert.ok(ObserverStub.all.every(observer => observer.disconnected));
  win.dispatchEvent(new Event('scroll')); assert.equal(frames.size, 0);
});

test('browsers without IntersectionObserver keep every section readable', () => {
  const { above, below, zone } = setup({ observer: false });
  assert.equal(above.dataset.revealState, 'seen');
  assert.equal(below.dataset.revealState, 'seen');
  assert.equal(zone.dataset.inView, 'true');
});
