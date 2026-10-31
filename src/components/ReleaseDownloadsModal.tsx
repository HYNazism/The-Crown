import React, { useEffect } from 'react';
import { DICTIONARY, formatNum, Language } from '../game/i18n';

interface ReleaseDownloadsModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

function resolveGitHubReleasesBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (host.endsWith('.github.io') && pathParts.length > 0) {
      const owner = host.replace('.github.io', '');
      const repo = pathParts[0];
      return `https://github.com/${owner}/${repo}/releases/latest/download`;
    }
  }
  return './version-manifest.json';
}

export const ReleaseDownloadsModal: React.FC<ReleaseDownloadsModalProps> = ({
  isOpen,
  lang,
  onClose,
}) => {
  const t = DICTIONARY[lang];
  const isRtl = lang !== 'en';

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const baseUrl = resolveGitHubReleasesBaseUrl();
  const isGitHubPages = baseUrl.startsWith('https://github.com/');

  const packages = [
    {
      id: 'android',
      title: t.downloadAndroidApk,
      desc: t.downloadAndroidDesc,
      href: isGitHubPages
        ? `${baseUrl}/Shahnameh-Crown-of-Ash-and-Light-android.apk`
        : './version-manifest.json',
      filename: 'Shahnameh-Crown-of-Ash-and-Light-android.apk',
      accent: 'border-emerald-600/70 bg-emerald-950/40 hover:bg-emerald-900/50',
    },
    {
      id: 'windows',
      title: t.downloadWindowsExe,
      desc: t.downloadWindowsDesc,
      href: isGitHubPages
        ? `${baseUrl}/Shahnameh-Crown-of-Ash-and-Light-windows-x64.exe`
        : './version-manifest.json',
      filename: 'Shahnameh-Crown-of-Ash-and-Light-windows-x64.exe',
      accent: 'border-amber-600/70 bg-amber-950/40 hover:bg-amber-900/50',
    },
    {
      id: 'linux-mac',
      title: t.downloadLinuxMac,
      desc: t.downloadLinuxMacDesc,
      href: isGitHubPages
        ? `${baseUrl}/Shahnameh-Crown-of-Ash-and-Light-linux-x64.tar.gz`
        : './version-manifest.json',
      filename: 'Shahnameh-Crown-of-Ash-and-Light-linux-x64.tar.gz',
      accent: 'border-sky-600/70 bg-sky-950/40 hover:bg-sky-900/50',
    },
    {
      id: 'web-zip',
      title: t.downloadWebZip,
      desc: t.downloadWebZipDesc,
      href: isGitHubPages
        ? `${baseUrl}/Shahnameh-Crown-of-Ash-and-Light-web-pwa.zip`
        : './version-manifest.json',
      filename: 'Shahnameh-Crown-of-Ash-and-Light-web-pwa.zip',
      accent: 'border-red-600/70 bg-red-950/40 hover:bg-red-900/50',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.releasesModalTitle}
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border-2 border-amber-600/80 bg-stone-950 p-5 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-amber-300">
              {t.releasesModalTitle}
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              {t.releasesModalSubtitle}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-amber-900/60 border border-amber-600/60 text-amber-200 text-xs font-bold tabular-nums shrink-0">
            {formatNum(12, lang)}.{formatNum(0, lang)}.{formatNum(0, lang)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {packages.map((pkg) => (
            <a
              key={pkg.id}
              href={pkg.href}
              download={pkg.filename}
              className={`block p-3.5 rounded-xl border transition-colors cursor-pointer ${pkg.accent}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-amber-200">
                  {pkg.title}
                </span>
                <svg
                  className="w-4 h-4 text-amber-400 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {pkg.desc}
              </p>
            </a>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-extrabold text-xs sm:text-sm cursor-pointer"
          >
            {t.closeReleasesModal}
          </button>
        </div>
      </div>
    </div>
  );
};
