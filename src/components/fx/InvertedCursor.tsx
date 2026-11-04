'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/* ============================================================================
   THE INVERTED CURSOR — the second interaction the owner confirmed (3
   November 2026), from Framer University's "Inverted Custom Cursor".

   A 32px white disc that follows the pointer on a short spring and inverts
   whatever is under it (`mix-blend-mode: difference`): white over the
   black ground, black over a white panel, the photograph's own negative
   over a picture. It grows to 2.5× over anything that can be pressed — a
   link, a button, anything marked `data-cursor="grow"` — and shrinks to
   0.8 while the pointer is down. The native cursor is hidden only while
   this one is drawn (`html.cursor-on`), so the page never loses its
   cursor to a script that did not run.

   IT NEVER APPEARS on a coarse pointer (a touch screen has no cursor to
   invert), under prefers-reduced-motion, over a text field (the I-beam is
   the right cursor there), while the curtain is up, or before the pointer
   has moved. It is mounted by components/CursorMount.tsx, the last child
   of <body>, outside <main>, so no ancestor isolates its blend mode; and
   it is loaded only after the first pointer move on a fine-pointer device,
   so a phone never downloads it.
   ========================================================================= */

const SPRING = { stiffness: 400, damping: 30, mass: 0.5 };
const GROW = 'a, button, [role="button"], [data-cursor="grow"], summary, label';
const TEXT = 'input, textarea, select, [contenteditable="true"]';

export default function InvertedCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const [scale, setScale] = useState(1);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    let down = false;
    let overText = false;
    let overGrow = false;
    let curtainUp = window.__curtainUp !== false;
    const apply = () => {
      const on = shown && curtainUp && !overText;
      root.classList.toggle('cursor-on', on);
      setScale(down ? 0.8 : overGrow ? 2.5 : 1);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target instanceof Element ? e.target : null;
      overText = Boolean(t?.closest(TEXT));
      overGrow = Boolean(t?.closest(GROW));
      if (!shown) setShown(true);
      apply();
    };
    const onDown = () => {
      down = true;
      apply();
    };
    const onUp = () => {
      down = false;
      apply();
    };
    const onLeave = () => {
      setShown(false);
      root.classList.remove('cursor-on');
    };
    const onCurtain = () => {
      curtainUp = true;
      apply();
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('curtain:up', onCurtain);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('curtain:up', onCurtain);
      root.classList.remove('cursor-on');
    };
  }, [shown, x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="cursor"
      style={{ x: sx, y: sy, scale, opacity: shown ? 1 : 0 }}
    />
  );
}
