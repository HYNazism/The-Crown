import React, { useRef, useState } from 'react';
import { DICTIONARY, formatNum, Language } from '../game/i18n';
import { VirtualControlState } from './ArenaCanvas';

interface TouchControlsProps {
  lang: Language;
  virtualInputRef: React.MutableRefObject<VirtualControlState>;
  cooldowns: {
    lasso: number;
    fire: number;
    dodge: number;
  };
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  lang,
  virtualInputRef,
  cooldowns,
}) => {
  const t = DICTIONARY[lang];
  const stickZoneRef = useRef<HTMLDivElement | null>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });

  const handleStickMove = (clientX: number, clientY: number) => {
    const zone = stickZoneRef.current;
    if (!zone) return;
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const maxR = rect.width * 0.38;
    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, maxR);
    const nx = dist > 0.01 ? dx / dist : 0;
    const ny = dist > 0.01 ? dy / dist : 0;

    setKnobOffset({ x: nx * clampedDist, y: ny * clampedDist });
    virtualInputRef.current.moveX = nx * (clampedDist / maxR);
    virtualInputRef.current.moveZ = ny * (clampedDist / maxR);
  };

  const resetStick = () => {
    setKnobOffset({ x: 0, y: 0 });
    virtualInputRef.current.moveX = 0;
    virtualInputRef.current.moveZ = 0;
  };

  return (
    <div
      dir="ltr"
      className="fixed inset-x-0 bottom-3 z-20 flex items-end justify-between gap-3 px-3 sm:px-5 pointer-events-none select-none"
    >
      {/* Left Virtual Joystick (Visible on Mobile/Tablet or Touch Viewports) */}
      <div
        ref={stickZoneRef}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handleStickMove(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.buttons > 0) handleStickMove(e.clientX, e.clientY);
        }}
        onPointerUp={resetStick}
        onPointerCancel={resetStick}
        className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full border-2 border-amber-600/60 bg-stone-950/80 flex items-center justify-center pointer-events-auto touch-none md:hidden"
      >
        <div
          style={{
            transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)`,
          }}
          className="w-10 h-10 rounded-full bg-amber-500/85 border border-amber-200 shadow-md"
        />
      </div>

      {/* 2x2 Compact Grid on Mobile, Horizontal Dock on Desktop */}
      <div className="grid grid-cols-2 md:flex items-center gap-1.5 sm:gap-2.5 md:mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            virtualInputRef.current.strikeQueued = true;
            e.currentTarget.blur();
          }}
          className="min-w-20 sm:min-w-24 h-12 sm:h-14 px-2.5 sm:px-3 rounded-xl border-2 border-red-600/80 bg-red-950/90 hover:bg-red-900 active:scale-95 text-amber-100 flex flex-col items-center justify-center shadow-lg cursor-pointer"
        >
          <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
            {t.skillStrike}
          </span>
          <span className="text-[10px] text-amber-300/80 tabular-nums">
            {lang === 'en' ? '[Space]' : '[فاصله]'}
          </span>
        </button>

        <button
          type="button"
          disabled={cooldowns.lasso > 0.1}
          onClick={(e) => {
            virtualInputRef.current.lassoQueued = true;
            e.currentTarget.blur();
          }}
          className={`min-w-20 sm:min-w-24 h-12 sm:h-14 px-2.5 sm:px-3 rounded-xl border border-amber-500/70 flex flex-col items-center justify-center shadow-lg cursor-pointer ${
            cooldowns.lasso > 0.1
              ? 'bg-stone-900/80 text-stone-500 opacity-60'
              : 'bg-stone-900/90 hover:bg-amber-950 text-amber-200 active:scale-95'
          }`}
        >
          <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
            {t.skillLasso}
          </span>
          <span className="text-[10px] text-amber-400 tabular-nums">
            {cooldowns.lasso > 0.1
              ? formatNum(Math.ceil(cooldowns.lasso), lang)
              : formatNum(1, lang)}
          </span>
        </button>

        <button
          type="button"
          disabled={cooldowns.fire > 0.1}
          onClick={(e) => {
            virtualInputRef.current.fireQueued = true;
            e.currentTarget.blur();
          }}
          className={`min-w-20 sm:min-w-24 h-12 sm:h-14 px-2.5 sm:px-3 rounded-xl border border-orange-500/70 flex flex-col items-center justify-center shadow-lg cursor-pointer ${
            cooldowns.fire > 0.1
              ? 'bg-stone-900/80 text-stone-500 opacity-60'
              : 'bg-stone-900/90 hover:bg-orange-950 text-orange-200 active:scale-95'
          }`}
        >
          <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
            {t.skillFireStone}
          </span>
          <span className="text-[10px] text-orange-400 tabular-nums">
            {cooldowns.fire > 0.1
              ? formatNum(Math.ceil(cooldowns.fire), lang)
              : formatNum(2, lang)}
          </span>
        </button>

        <button
          type="button"
          disabled={cooldowns.dodge > 0.1}
          onClick={(e) => {
            virtualInputRef.current.dodgeQueued = true;
            e.currentTarget.blur();
          }}
          className={`min-w-20 sm:min-w-24 h-12 sm:h-14 px-2.5 sm:px-3 rounded-xl border border-sky-500/70 flex flex-col items-center justify-center shadow-lg cursor-pointer ${
            cooldowns.dodge > 0.1
              ? 'bg-stone-900/80 text-stone-500 opacity-60'
              : 'bg-stone-900/90 hover:bg-sky-950 text-sky-200 active:scale-95'
          }`}
        >
          <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
            {t.skillDodge}
          </span>
          <span className="text-[10px] text-sky-400 tabular-nums">
            {cooldowns.dodge > 0.1
              ? formatNum(Math.ceil(cooldowns.dodge), lang)
              : formatNum(3, lang)}
          </span>
        </button>
      </div>
    </div>
  );
};
