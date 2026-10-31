import React from 'react';
import { DICTIONARY, formatNum, Language } from '../game/i18n';
import {
  CameraPerspective,
  DifficultyLevel,
  GameSettings,
  GoreIntensity,
  GraphicsQuality,
} from '../game/rules';

interface SettingsModalProps {
  isOpen: boolean;
  lang: Language;
  settings: GameSettings;
  onChangeLang: (lang: Language) => void;
  onChangeSettings: (next: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  lang,
  settings,
  onChangeLang,
  onChangeSettings,
  onClose,
}) => {
  if (!isOpen) return null;
  const t = DICTIONARY[lang];

  const update = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K],
  ) => {
    onChangeSettings({ ...settings, [key]: value });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.settingsTitle}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto"
      style={{ backgroundColor: 'rgba(9, 7, 6, 0.88)' }}
    >
      <div className="w-full max-w-xl rounded-xl border border-amber-700/60 bg-stone-950 p-6 text-amber-50 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-3 mb-5">
          <h2 className="text-xl font-bold text-amber-400">{t.settingsTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeSettings}
            className="px-3 py-1 text-sm font-semibold rounded border border-amber-700/50 bg-stone-900 hover:bg-stone-800 text-amber-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          {/* Language Switcher */}
          <div>
            <label className="block text-xs font-semibold text-amber-300/90 mb-2">
              {t.languageLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['fa', 'fa_old', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onChangeLang(l)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    lang === l
                      ? 'bg-amber-700 border-amber-400 text-stone-950'
                      : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-700/50'
                  }`}
                >
                  {l === 'fa'
                    ? t.langFa
                    : l === 'fa_old'
                    ? t.langFaOld
                    : t.langEn}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300">{t.masterVolume}</span>
                <span className="tabular-nums text-amber-400">
                  {formatNum(settings.masterVolume, lang)}{lang === 'en' ? '%' : '٪'}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.masterVolume}
                aria-label={t.masterVolume}
                onChange={(e) => update('masterVolume', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300">{t.sfxVolume}</span>
                <span className="tabular-nums text-amber-400">
                  {formatNum(settings.sfxVolume, lang)}{lang === 'en' ? '%' : '٪'}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.sfxVolume}
                aria-label={t.sfxVolume}
                onChange={(e) => update('sfxVolume', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-300">{t.musicVolume}</span>
                <span className="tabular-nums text-amber-400">
                  {formatNum(settings.musicVolume, lang)}{lang === 'en' ? '%' : '٪'}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.musicVolume}
                aria-label={t.musicVolume}
                onChange={(e) => update('musicVolume', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Camera Perspective (3D vs 2D) & Camera Shake */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-amber-300/90 mb-2">
                {t.cameraMode}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['3d', '2d'] as CameraPerspective[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => update('cameraMode', mode)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                      settings.cameraMode === mode
                        ? 'bg-amber-700 border-amber-400 text-stone-950'
                        : 'bg-stone-900 border-stone-700 text-stone-300'
                    }`}
                  >
                    {mode === '3d' ? t.mode3D : t.mode2D}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300/90 mb-2">
                {t.cameraShake}
              </label>
              <button
                type="button"
                onClick={() => update('cameraShake', !settings.cameraShake)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                  settings.cameraShake
                    ? 'bg-amber-700 border-amber-400 text-stone-950'
                    : 'bg-stone-900 border-stone-700 text-stone-300'
                }`}
              >
                {settings.cameraShake ? t.enabled : t.disabled}
              </button>
            </div>
          </div>

          {/* Graphics Quality */}
          <div>
            <label className="block text-xs font-semibold text-amber-300/90 mb-2">
              {t.graphicsQuality}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                ['low', 'medium', 'high', 'ultra'] as GraphicsQuality[]
              ).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => update('graphicsQuality', q)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                    settings.graphicsQuality === q
                      ? 'bg-amber-700 border-amber-400 text-stone-950'
                      : 'bg-stone-900 border-stone-700 text-stone-300'
                  }`}
                >
                  {q === 'low'
                    ? t.qualityLow
                    : q === 'medium'
                    ? t.qualityMedium
                    : q === 'high'
                    ? t.qualityHigh
                    : t.qualityUltra}
                </button>
              ))}
            </div>
          </div>

          {/* Gore Intensity & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-amber-300/90 mb-2">
                {t.goreIntensity}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'brutal'] as GoreIntensity[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => update('goreIntensity', g)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                      settings.goreIntensity === g
                        ? 'bg-red-800 border-red-400 text-white'
                        : 'bg-stone-900 border-stone-700 text-stone-300'
                    }`}
                  >
                    {g === 'low'
                      ? t.goreLow
                      : g === 'medium'
                      ? t.goreMedium
                      : t.goreBrutal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300/90 mb-2">
                {t.difficulty}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['story', 'heroic', 'mythic'] as DifficultyLevel[]).map(
                  (d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => update('difficulty', d)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                        settings.difficulty === d
                          ? 'bg-amber-700 border-amber-400 text-stone-950'
                          : 'bg-stone-900 border-stone-700 text-stone-300'
                      }`}
                    >
                      {d === 'story'
                        ? t.diffStory
                        : d === 'heroic'
                        ? t.diffHeroic
                        : t.diffMythic}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-amber-800/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors"
          >
            {t.closeSettings}
          </button>
        </div>
      </div>
    </div>
  );
};
