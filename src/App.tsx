import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArenaCanvas,
  LiveHUDTelemetry,
  VirtualControlState,
} from './components/ArenaCanvas';
import { DestinyScrollModal } from './components/DestinyScrollModal';
import { SettingsModal } from './components/SettingsModal';
import { TouchControls } from './components/TouchControls';
import { usePWAInstall } from './components/usePWAInstall';
import { Faction, SHAHNAMEH_EPOCHS } from './game/epochs';
import { DICTIONARY, formatNum, Language } from './game/i18n';
import {
  applyMoralCrossroadsChoice,
  BattlePhase,
  CampaignState,
  createInitialCampaignState,
  DEFAULT_SETTINGS,
  GameSettings,
  resolveEpochRoles,
} from './game/rules';

interface ShahnamehLoadingOverlayProps {
  lang: Language;
  progress: number;
  onDismiss: () => void;
}

function ShahnamehLoadingOverlay({
  lang,
  progress,
  onDismiss,
}: ShahnamehLoadingOverlayProps) {
  const t = DICTIONARY[lang];
  const percentSymbol = lang === 'en' ? '%' : '٪';

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-stone-950/95 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
    >
      {/* Custom Shahnameh Branded Spinner (12-Epoch Sun Wheel + Royal Kayani Crown) */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center mb-6">
        {/* Outer rotating 12-Epoch Sassanid Ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin text-amber-500/85"
          style={{ animationDuration: '9s' }}
          viewBox="0 0 120 120"
          fill="none"
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 6"
          />
          <circle
            cx="60"
            cy="60"
            r="46"
            stroke="#dc2626"
            strokeOpacity="0.65"
            strokeWidth="1.5"
          />
          {Array.from({ length: 12 }).map((_, idx) => {
            const angle = (idx * 30 * Math.PI) / 180;
            const x1 = 60 + Math.cos(angle) * 46;
            const y1 = 60 + Math.sin(angle) * 46;
            const x2 = 60 + Math.cos(angle) * 56;
            const y2 = 60 + Math.sin(angle) * 56;
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Inner counter-rotating Lapis/Gold Octagram */}
        <svg
          className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] animate-spin text-amber-400/60"
          style={{ animationDuration: '5s', animationDirection: 'reverse' }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <rect
            x="22"
            y="22"
            width="56"
            height="56"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="22"
            y="22"
            width="56"
            height="56"
            transform="rotate(45 50 50)"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
        </svg>

        {/* Central Kayani Crown & Simurgh Emblem */}
        <svg
          className="relative w-14 h-14 text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.65)] animate-pulse"
          viewBox="0 0 64 64"
          fill="none"
        >
          <path
            d="M10 46L14 22L26 32L32 14L38 32L50 22L54 46H10Z"
            fill="#b45309"
            stroke="#fde68a"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="12" r="3" fill="#fef08a" />
          <circle cx="14" cy="20" r="2.5" fill="#ef4444" />
          <circle cx="50" cy="20" r="2.5" fill="#ef4444" />
          <circle cx="32" cy="36" r="3.5" fill="#dc2626" />
          <rect x="10" y="48" width="44" height="5" rx="2" fill="#fbbf24" />
        </svg>
      </div>

      {/* Branded Title & Subtitle */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-wide text-center mb-1">
        {t.gameTitle}
      </h1>
      <p className="text-xs sm:text-sm font-bold text-amber-500/90 mb-5 text-center">
        {t.gameSubtitle}
      </p>

      {/* Progress Bar & Localized Percentage */}
      <div className="w-64 sm:w-80 bg-stone-900 border border-amber-700/60 rounded-full h-2.5 overflow-hidden mb-2.5 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-red-700 via-amber-500 to-amber-300 transition-all duration-150"
          style={{ width: `${Math.min(100, Math.max(10, progress))}%` }}
        />
      </div>

      <div className="flex items-center gap-3 text-xs text-stone-300 font-semibold">
        <span>{t.loadingAssets}</span>
        <span className="text-amber-400 font-extrabold tabular-nums">
          {formatNum(progress, lang)}
          {percentSymbol}
        </span>
      </div>
    </div>
  );
}

const PREFS_STORAGE_KEY = 'shahnameh_prefs_v1';
const CAMPAIGN_STORAGE_KEY = 'shahnameh_campaign_v1';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lang === 'fa' || parsed.lang === 'fa_old' || parsed.lang === 'en') {
          return parsed.lang;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return 'fa';
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = window.localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.settings && typeof parsed.settings === 'object') {
          return { ...DEFAULT_SETTINGS, ...parsed.settings };
        }
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_SETTINGS;
  });

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [isBooting, setIsBooting] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' || params.get('skipIntro') === '1') {
        return false;
      }
    }
    return true;
  });
  const [bootProgress, setBootProgress] = useState<number>(20);

  useEffect(() => {
    if (!isBooting) return;
    const step1 = window.setTimeout(() => setBootProgress(65), 140);
    const step2 = window.setTimeout(() => setBootProgress(100), 320);
    const done = window.setTimeout(() => setIsBooting(false), 480);
    return () => {
      window.clearTimeout(step1);
      window.clearTimeout(step2);
      window.clearTimeout(done);
    };
  }, [isBooting]);

  const [campaign, setCampaign] = useState<CampaignState>(() => {
    try {
      const saved = window.localStorage.getItem(CAMPAIGN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          typeof parsed.currentEpochId === 'number' &&
          parsed.currentEpochId >= 1 &&
          parsed.currentEpochId <= 12
        ) {
          return { ...createInitialCampaignState('asha'), ...parsed };
        }
      }
    } catch {
      // Ignore storage errors
    }
    return createInitialCampaignState('asha');
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        PREFS_STORAGE_KEY,
        JSON.stringify({ lang, settings }),
      );
    } catch {
      // Ignore storage errors
    }
  }, [lang, settings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CAMPAIGN_STORAGE_KEY,
        JSON.stringify(campaign),
      );
    } catch {
      // Ignore storage errors
    }
  }, [campaign]);

  const [gameState, setGameState] = useState<
    'title' | 'playing' | 'paused' | 'gameover'
  >(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'playing';
      }
    }
    return 'title';
  });

  const [battlePhase, setBattlePhase] = useState<BattlePhase>('vanguard');
  const [battleVictory, setBattleVictory] = useState(true);
  const [runResetCounter, setRunResetCounter] = useState(0);

  const [telemetry, setTelemetry] = useState<LiveHUDTelemetry>({
    playerHp: 100,
    playerMaxHp: 100,
    farrCharge: 50,
    waveCleared: 0,
    waveTotal: 4,
    bossHp: 250,
    bossMaxHp: 250,
    phase: 'vanguard',
    comboCount: 0,
    cooldowns: { lasso: 0, fire: 0, dodge: 0 },
    stats: { clearTimeSec: 0, damageDealt: 0, enemiesSlain: 0 },
  });

  const virtualInputRef = useRef<VirtualControlState>({
    moveX: 0,
    moveZ: 0,
    strikeQueued: false,
    lassoQueued: false,
    fireQueued: false,
    dodgeQueued: false,
  });

  const { isInstallable, isInstalled, install } = usePWAInstall();

  const t = DICTIONARY[lang];
  const isRtl = lang !== 'en';

  // Keep HTML lang/dir attributes and body data-state synchronized
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'fa';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [lang, isRtl]);

  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  const resolvedRoles = useMemo(
    () => resolveEpochRoles(campaign.currentEpochId, campaign.faction),
    [campaign.currentEpochId, campaign.faction],
  );

  const startBattle = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsBooting(false);
    document.body.dataset.state = 'playing';
    setBattlePhase('vanguard');
    setGameState('playing');
    setRunResetCounter((c) => c + 1);
  }, []);

  // Global keyboard shortcuts for Title start (Enter/Space) and Pause (Escape/P)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (settingsOpen) return;
      if (gameState === 'title' && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        startBattle();
      } else if (
        gameState === 'playing' &&
        (e.code === 'Escape' || e.code === 'KeyP')
      ) {
        e.preventDefault();
        setGameState('paused');
      } else if (
        gameState === 'paused' &&
        (e.code === 'Escape' || e.code === 'KeyP')
      ) {
        e.preventDefault();
        setGameState('playing');
      } else if (e.code === 'KeyM') {
        setSettings((s) => ({ ...s, muted: !s.muted }));
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [gameState, settingsOpen, startBattle]);

  const handleReachCrossroads = useCallback(() => {
    setBattlePhase('crossroads');
  }, []);

  const handleSelectDestinyChoice = useCallback(
    (chosenPath: Faction) => {
      setCampaign((prev) =>
        applyMoralCrossroadsChoice(prev, resolvedRoles.epoch, chosenPath),
      );
      setBattlePhase('boss_duel');
    },
    [resolvedRoles.epoch],
  );

  const handleBattleOutcome = useCallback(
    (
      victory: boolean,
      stats: { clearTimeSec: number; damageDealt: number; enemiesSlain: number },
    ) => {
      setBattleVictory(victory);
      setTelemetry((prev) => ({ ...prev, stats }));
      setBattlePhase(victory ? 'victory' : 'defeat');
      setGameState('gameover');
    },
    [],
  );

  const handleAdvanceNextEpoch = () => {
    const nextId =
      campaign.currentEpochId < 12 ? campaign.currentEpochId + 1 : 1;
    setCampaign((prev) => ({
      ...prev,
      currentEpochId: nextId,
    }));
    startBattle();
  };

  return (
    <main
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-screen h-screen overflow-hidden select-none bg-stone-950 text-amber-50"
    >
      {/* Shahnameh Branded Initial PWA Loading Overlay */}
      {isBooting && (
        <ShahnamehLoadingOverlay
          lang={lang}
          progress={bootProgress}
          onDismiss={() => setIsBooting(false)}
        />
      )}

      {/* Full-Viewport 3D/2D WebGL Arena Canvas */}
      <ArenaCanvas
        key={runResetCounter}
        gameState={gameState}
        epochId={campaign.currentEpochId}
        faction={campaign.faction}
        attackMultiplier={campaign.attackMultiplier}
        settings={settings}
        battlePhase={battlePhase}
        virtualInputRef={virtualInputRef}
        onTelemetryUpdate={setTelemetry}
        onReachCrossroads={handleReachCrossroads}
        onBattleOutcome={handleBattleOutcome}
      />

      {/* =====================================================================
          1. TITLE SCREEN OVERLAY
         ===================================================================== */}
      {gameState === 'title' && (
        <div
          className="fixed inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto"
          style={{
            background:
              'radial-gradient(circle at 50% 25%, rgba(12, 10, 9, 0.35) 0%, rgba(9, 7, 6, 0.88) 78%)',
          }}
        >
          {/* Top Utility Strip (Language, Sound Mute, Settings, PWA Install) */}
          <div className="flex items-center justify-between gap-3 w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-1.5 bg-stone-950/90 border border-amber-700/50 rounded-lg p-1">
              {(['fa', 'fa_old', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    lang === l
                      ? 'bg-amber-600 text-stone-950'
                      : 'text-amber-200/80 hover:text-white'
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

            <div className="flex items-center gap-2">
              {!isInstalled && isInstallable && (
                <button
                  type="button"
                  onClick={install}
                  className="px-3 py-1.5 rounded-lg border border-amber-500/70 bg-amber-900/70 hover:bg-amber-800 text-amber-100 text-xs font-bold cursor-pointer"
                >
                  {t.installApp}
                </button>
              )}

              <button
                type="button"
                aria-label={settings.muted ? t.soundOff : t.soundOn}
                onClick={() =>
                  setSettings((s) => ({ ...s, muted: !s.muted }))
                }
                className="w-9 h-9 rounded-lg border border-amber-700/60 bg-stone-950/90 hover:bg-stone-900 flex items-center justify-center text-amber-300 cursor-pointer"
              >
                {settings.muted ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                aria-label={t.settings}
                onClick={() => setSettingsOpen(true)}
                className="w-9 h-9 rounded-lg border border-amber-700/60 bg-stone-950/90 hover:bg-stone-900 flex items-center justify-center text-amber-300 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Center Hero Title Lockup + Faction & 12-Epoch Selector */}
          <div className="w-full max-w-5xl mx-auto my-auto py-2 flex flex-col items-center">
            {/* Custom Inline SVG Title Crest */}
            <div className="flex flex-col items-center text-center mb-4">
              <svg
                className="w-16 h-12 sm:w-20 sm:h-14 mb-1"
                viewBox="0 0 160 110"
                fill="none"
              >
                <path
                  d="M20 85 L34 32 L62 60 L80 14 L98 60 L126 32 L140 85 Z"
                  fill="#d97706"
                  stroke="#fef08a"
                  strokeWidth="3"
                />
                <path d="M80 4 L90 30 L80 24 L70 30 Z" fill="#dc2626" />
                <rect
                  x="20"
                  y="90"
                  width="120"
                  height="10"
                  rx="4"
                  fill="#b45309"
                />
              </svg>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-amber-300 stroke-text">
                {t.gameTitle}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-amber-500/95">
                {t.gameSubtitle}
              </p>
            </div>

            {/* Faction Selection (Good vs. Evil with full role inversion) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() =>
                  setCampaign((c) => ({ ...c, faction: 'asha' }))
                }
                className={`p-3.5 rounded-xl border text-start transition-colors cursor-pointer ${
                  campaign.faction === 'asha'
                    ? 'bg-amber-950/90 border-amber-400 shadow-lg'
                    : 'bg-stone-950/85 border-stone-800 hover:border-amber-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-amber-300">
                    {t.factionGoodName}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">
                    {campaign.faction === 'asha' ? '✦' : ''}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-snug">
                  {t.factionGoodDesc}
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setCampaign((c) => ({ ...c, faction: 'ahriman' }))
                }
                className={`p-3.5 rounded-xl border text-start transition-colors cursor-pointer ${
                  campaign.faction === 'ahriman'
                    ? 'bg-red-950/90 border-red-500 shadow-lg'
                    : 'bg-stone-950/85 border-stone-800 hover:border-red-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-red-400">
                    {t.factionEvilName}
                  </span>
                  <span className="text-xs text-red-400 font-semibold">
                    {campaign.faction === 'ahriman' ? '✦' : ''}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-snug">
                  {t.factionEvilDesc}
                </p>
              </button>
            </div>

            {/* 12 Epochs Grid Selector */}
            <div className="w-full bg-stone-950/90 border border-amber-800/50 rounded-xl p-3.5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300">
                  {t.selectEpoch}
                </span>
                <span className="text-xs text-stone-400 tabular-nums">
                  {formatNum(campaign.currentEpochId, lang)} /{' '}
                  {formatNum(12, lang)}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5 mb-3">
                {SHAHNAMEH_EPOCHS.map((ep) => {
                  const active = ep.id === campaign.currentEpochId;
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() =>
                        setCampaign((c) => ({ ...c, currentEpochId: ep.id }))
                      }
                      aria-label={ep.title[lang]}
                      className={`py-2 px-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer tabular-nums ${
                        active
                          ? 'bg-amber-600 border-amber-300 text-stone-950'
                          : 'bg-stone-900 border-stone-800 text-amber-200/80 hover:border-amber-700/60'
                      }`}
                    >
                      {formatNum(ep.id, lang)}
                    </button>
                  );
                })}
              </div>

              {/* Selected Epoch Details & Inverted Character Matchup Preview */}
              <div className="border-t border-stone-800 pt-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-bold text-amber-200">
                    {resolvedRoles.epoch.title[lang]}
                  </h2>
                  <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
                    {resolvedRoles.epoch.loreIntro[lang]}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 bg-stone-900/90 border border-amber-900/40 rounded-lg px-3 py-2 text-xs">
                  <div>
                    <div className="text-[11px] text-stone-400">
                      {t.commanderRoleLabel}
                    </div>
                    <div className="font-bold text-amber-300">
                      {resolvedRoles.playerSpec.name[lang]}
                    </div>
                  </div>
                  <span className="text-stone-500 font-bold">⚔</span>
                  <div>
                    <div className="text-[11px] text-stone-400">
                      {t.bossOpponentLabel}
                    </div>
                    <div className="font-bold text-red-400">
                      {resolvedRoles.bossSpec.name[lang]}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Start Battle CTA */}
            <button
              type="button"
              data-start="true"
              onClick={startBattle}
              className="px-10 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-stone-950 font-extrabold text-base sm:text-lg shadow-xl transition-transform cursor-pointer"
            >
              {t.startBattle}
            </button>
          </div>

          {/* Single Flat Control-Hint Line in Bottom Safe Margin */}
          <div className="text-center text-xs text-stone-400">
            <span className="hidden md:inline">{t.controlsHintDesktop}</span>
            <span className="md:hidden">{t.controlsHintTouch}</span>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. PLAYING HUD (World-Matched, Low-Occlusion, >= 85% Clear Viewport)
         ===================================================================== */}
      {gameState === 'playing' && (
        <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-2.5 sm:p-5">
          {/* Top Perimeter Row */}
          <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2 sm:gap-4">
            {/* Top-Start: Player Vitality, Farr/Wrath & Iranshahr Stability */}
            <div className="bg-stone-950/90 border border-amber-700/60 rounded-xl p-2.5 sm:p-3 flex-1 sm:flex-none sm:min-w-64 shadow-lg">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-amber-300 truncate">
                  {resolvedRoles.playerSpec.name[lang]}
                </span>
                <span className="text-[11px] text-amber-500 font-semibold tabular-nums shrink-0">
                  {t.epochWord} {formatNum(campaign.currentEpochId, lang)}
                </span>
              </div>

              {/* Vitality Bar */}
              <div className="mb-1.5">
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-stone-300">{t.hpLabel}</span>
                  <span className="tabular-nums font-bold text-amber-200">
                    {formatNum(telemetry.playerHp, lang)} /{' '}
                    {formatNum(telemetry.playerMaxHp, lang)}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-900 rounded overflow-hidden border border-stone-700">
                  <div
                    className="h-full bg-red-600 transition-all duration-150"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          (telemetry.playerHp / telemetry.playerMaxHp) * 100,
                        ),
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Farr / Wrath & Stability Readouts */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-300 tabular-nums">
                <span>
                  {campaign.faction === 'asha'
                    ? t.farrLabelGood
                    : t.farrLabelEvil}
                  : {formatNum(telemetry.farrCharge, lang)}
                  {lang === 'en' ? '%' : '٪'}
                </span>
                <span>·</span>
                <span>
                  {t.stabilityLabel}:{' '}
                  {formatNum(campaign.iranshahrStability, lang)}
                  {lang === 'en' ? '%' : '٪'}
                </span>
                {telemetry.comboCount && telemetry.comboCount >= 2 ? (
                  <>
                    <span>·</span>
                    <span className="text-amber-400 font-extrabold">
                      {t.comboLabel}: ×{formatNum(telemetry.comboCount, lang)}
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {/* Top-End Utility Controls (Mute, Settings, Pause) */}
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto sm:order-3 shrink-0">
              <button
                type="button"
                tabIndex={-1}
                aria-label={settings.muted ? t.soundOff : t.soundOn}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSettings((s) => ({ ...s, muted: !s.muted }));
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-amber-700/60 bg-stone-950/90 hover:bg-stone-900 flex items-center justify-center text-amber-300 cursor-pointer"
              >
                {settings.muted ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label={t.settings}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setSettingsOpen(true);
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-amber-700/60 bg-stone-950/90 hover:bg-stone-900 flex items-center justify-center text-amber-300 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>

              <button
                type="button"
                tabIndex={-1}
                aria-label={t.pause}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setGameState('paused');
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-amber-700/60 bg-stone-950/90 hover:bg-stone-900 flex items-center justify-center text-amber-300 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              </button>
            </div>

            {/* Top-Center: Vanguard Wave Status OR 1v1 Boss Health Bar */}
            <div className="w-full sm:w-auto sm:flex-1 max-w-md mx-auto sm:order-2">
              {battlePhase === 'boss_duel' ? (
                <div className="bg-stone-950/90 border-2 border-red-600/80 rounded-xl p-2.5 sm:p-3 shadow-xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-red-400 truncate">
                      {resolvedRoles.bossSpec.name[lang]}
                    </span>
                    <span className="tabular-nums font-bold text-red-200">
                      {formatNum(telemetry.bossHp, lang)} /{' '}
                      {formatNum(telemetry.bossMaxHp, lang)}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-stone-900 rounded overflow-hidden border border-red-900">
                    <div
                      className="h-full bg-red-600 transition-all duration-100"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            (telemetry.bossHp / telemetry.bossMaxHp) * 100,
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-center text-amber-400/90 mt-1">
                    {t.bossDuelLabel}
                  </div>
                </div>
              ) : (
                <div className="bg-stone-950/85 border border-amber-800/50 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-center shadow-md flex sm:block items-center justify-between">
                  <div className="text-xs font-bold text-amber-300">
                    {resolvedRoles.enemyArmyTitle[lang]}
                  </div>
                  <div className="text-[11px] text-stone-300 tabular-nums sm:mt-0.5">
                    {t.waveLabel}: {formatNum(telemetry.waveCleared, lang)} /{' '}
                    {formatNum(telemetry.waveTotal, lang)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Touch & Combat Skill Dock */}
          <TouchControls
            lang={lang}
            virtualInputRef={virtualInputRef}
            cooldowns={telemetry.cooldowns}
          />
        </div>
      )}

      {/* =====================================================================
          3. DESTINY SCROLL MODAL (Moral Crossroads before 1v1 Boss Duel)
         ===================================================================== */}
      {gameState === 'playing' && battlePhase === 'crossroads' && (
        <DestinyScrollModal
          epoch={resolvedRoles.epoch}
          lang={lang}
          onSelectChoice={handleSelectDestinyChoice}
        />
      )}

      {/* =====================================================================
          4. PAUSE MODAL
         ===================================================================== */}
      {gameState === 'paused' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.pause}
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(9, 7, 6, 0.85)' }}
        >
          <div className="w-full max-w-md rounded-xl border border-amber-600/70 bg-stone-950 p-6 text-center shadow-2xl space-y-4">
            <h2 className="text-2xl font-bold text-amber-300">{t.pause}</h2>
            <p className="text-xs text-stone-400">
              {resolvedRoles.epoch.title[lang]}
            </p>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setGameState('playing')}
                className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm cursor-pointer"
              >
                {t.resume}
              </button>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="w-full py-2.5 rounded-lg border border-amber-700/60 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold text-sm cursor-pointer"
              >
                {t.settings}
              </button>
              <button
                type="button"
                onClick={startBattle}
                className="w-full py-2.5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-300 font-semibold text-sm cursor-pointer"
              >
                {t.restartEpoch}
              </button>
              <button
                type="button"
                onClick={() => setGameState('title')}
                className="w-full py-2.5 rounded-lg border border-red-800/60 bg-red-950/50 hover:bg-red-900/60 text-red-200 font-semibold text-sm cursor-pointer"
              >
                {t.returnToTitle}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. VICTORY / GAME OVER MODAL
         ===================================================================== */}
      {gameState === 'gameover' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={battleVictory ? t.victoryTitle : t.defeatTitle}
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(9, 7, 6, 0.88)' }}
        >
          <div className="w-full max-w-lg rounded-xl border-2 border-amber-600/80 bg-stone-950 p-6 sm:p-8 text-center shadow-2xl space-y-5">
            <div>
              <div className="text-xs font-bold text-amber-400 mb-1">
                {resolvedRoles.epoch.title[lang]}
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold ${
                  battleVictory ? 'text-amber-300' : 'text-red-500'
                }`}
              >
                {battleVictory ? t.victoryTitle : t.defeatTitle}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-3">
                <div className="text-[11px] text-stone-400 mb-1">
                  {t.clearTimeLabel}
                </div>
                <div className="text-lg font-bold text-amber-300 tabular-nums">
                  {formatNum(Math.max(1, Math.round(telemetry.stats.clearTimeSec)), lang)}
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-lg p-3">
                <div className="text-[11px] text-stone-400 mb-1">
                  {t.damageDealtLabel}
                </div>
                <div className="text-lg font-bold text-red-400 tabular-nums">
                  {formatNum(telemetry.stats.damageDealt, lang)}
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-lg p-3">
                <div className="text-[11px] text-stone-400 mb-1">
                  {t.stabilityLabel}
                </div>
                <div className="text-lg font-bold text-emerald-400 tabular-nums">
                  {formatNum(campaign.iranshahrStability, lang)}{lang === 'en' ? '%' : '٪'}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {battleVictory ? (
                <button
                  type="button"
                  data-start="true"
                  onClick={handleAdvanceNextEpoch}
                  className="flex-1 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-extrabold text-sm cursor-pointer"
                >
                  {t.nextEpoch}
                </button>
              ) : (
                <button
                  type="button"
                  data-start="true"
                  onClick={startBattle}
                  className="flex-1 py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white font-extrabold text-sm cursor-pointer"
                >
                  {t.tryAgain}
                </button>
              )}

              <button
                type="button"
                onClick={() => setGameState('title')}
                className="py-3 px-5 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-stone-200 font-semibold text-sm cursor-pointer"
              >
                {t.returnToTitle}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          6. REAL IN-GAME SETTINGS MODAL
         ===================================================================== */}
      <SettingsModal
        isOpen={settingsOpen}
        lang={lang}
        settings={settings}
        onChangeLang={setLang}
        onChangeSettings={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </main>
  );
}
