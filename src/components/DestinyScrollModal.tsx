import React from 'react';
import { EpochData, Faction } from '../game/epochs';
import { DICTIONARY, formatNum, Language } from '../game/i18n';

interface DestinyScrollModalProps {
  epoch: EpochData;
  lang: Language;
  onSelectChoice: (chosenPath: Faction) => void;
}

export const DestinyScrollModal: React.FC<DestinyScrollModalProps> = ({
  epoch,
  lang,
  onSelectChoice,
}) => {
  const t = DICTIONARY[lang];
  const { crossroads } = epoch;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.destinyScrollTitle}
      className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-auto"
      style={{ backgroundColor: 'rgba(9, 7, 6, 0.88)' }}
    >
      <div className="w-full max-w-2xl rounded-xl border-2 border-amber-600/80 bg-stone-950 p-6 sm:p-8 text-amber-50 shadow-2xl">
        <div className="text-center border-b border-amber-800/50 pb-4 mb-5">
          <div className="text-xs font-semibold text-amber-400 tracking-wide mb-1">
            {epoch.title[lang]}
          </div>
          <h2 className="text-2xl font-bold text-amber-200">
            {t.destinyScrollTitle}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {t.destinyScrollSubtitle}
          </p>
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-amber-100/95 bg-stone-900/90 border border-amber-900/40 rounded-lg p-4 mb-6">
          {crossroads.prompt[lang]}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Path of Asha (Good) */}
          <button
            type="button"
            onClick={() => onSelectChoice('asha')}
            className="flex flex-col justify-between text-start p-4 rounded-xl border border-amber-500/60 bg-stone-900 hover:bg-amber-950/50 transition-colors cursor-pointer group"
          >
            <div>
              <div className="text-xs font-bold text-amber-400 mb-1">
                {t.choiceGoodTag}
              </div>
              <div className="text-sm font-bold text-amber-100 group-hover:text-white mb-2">
                {crossroads.ashaChoice.title[lang]}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {crossroads.ashaChoice.consequence[lang]}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-amber-800/40 flex items-center justify-between text-xs text-amber-300 tabular-nums">
              <span>
                {t.stabilityLabel}: +{formatNum(crossroads.ashaChoice.stabilityDelta, lang)}
              </span>
              <span>
                +{formatNum(Math.round(crossroads.ashaChoice.attackMultiplierBonus * 100), lang)}{lang === 'en' ? '%' : '٪'}
              </span>
            </div>
          </button>

          {/* Path of Ahriman (Evil) */}
          <button
            type="button"
            onClick={() => onSelectChoice('ahriman')}
            className="flex flex-col justify-between text-start p-4 rounded-xl border border-red-600/60 bg-stone-900 hover:bg-red-950/50 transition-colors cursor-pointer group"
          >
            <div>
              <div className="text-xs font-bold text-red-400 mb-1">
                {t.choiceEvilTag}
              </div>
              <div className="text-sm font-bold text-red-100 group-hover:text-white mb-2">
                {crossroads.ahrimanChoice.title[lang]}
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {crossroads.ahrimanChoice.consequence[lang]}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-red-900/40 flex items-center justify-between text-xs text-red-300 tabular-nums">
              <span>
                {t.stabilityLabel}: {formatNum(crossroads.ahrimanChoice.stabilityDelta, lang)}
              </span>
              <span>
                +{formatNum(Math.round(crossroads.ahrimanChoice.attackMultiplierBonus * 100), lang)}{lang === 'en' ? '%' : '٪'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
