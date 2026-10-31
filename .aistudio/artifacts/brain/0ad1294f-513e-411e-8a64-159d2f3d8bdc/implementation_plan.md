# Automated Multi-Platform GitHub Actions Release & GitHub Pages Pipeline

This plan establishes an automated continuous delivery and multi-platform release pipeline for **Shahnameh of Ferdowsi: Crown of Ash & Light (`شاهنامه فردوسی: تاج خاکستر و نور`)** that deploys the live Progressive Web App to **GitHub Pages** and publishes native downloadable builds (**Android `.apk`**, **Windows `.exe`**, **Linux/macOS desktop bundles**, and **PWA `.zip` archives**) to **GitHub Releases** on every push to `main` and on version tags.

## User Review & Critical Decisions

> [!IMPORTANT]
> All three release preferences from your answers have been incorporated into this architecture:

- **Confirmed Decision 1 — Dual Publishing Targets**: Every release run publishes both the live web game to **GitHub Pages** and a full **GitHub Release** with downloadable binaries.
- **Confirmed Decision 2 — Continuous & Tagged Release Triggers**: The pipeline triggers automatically on every push to `main` (updating/creating the latest release and live Pages site) as well as on semantic version tags (`v*`, such as `v12.0.0`) and manual workflow dispatch.
- **Confirmed Decision 3 — Multi-Platform Native Artifacts (`.apk`, `.exe`, `.zip`, Checksums)**: The workflow packages the compiled WebGL/PWA application into an installable **Android `.apk`** (via Capacitor Android + Gradle), a standalone **Windows `.exe`** desktop executable (via Electron Builder), a **Linux/macOS desktop bundle**, and a **Standalone Offline PWA `.zip`**, complete with `SHA256SUMS.txt` and bilingual Persian/English release notes.

---

## 1. Overview & Core Concept

- **What It Does**: Automates testing, manifest hashing, web deployment, and native cross-platform packaging so every update to the repository produces ready-to-install packages for Android phones/tablets (`.apk`), Windows PCs (`.exe`), desktop archives, and instant browser play via GitHub Pages.
- **Target Audience / Persona**: Players who want to download and install the game natively on Android devices (`.apk`) or Windows desktops (`.exe`) from GitHub Releases, as well as players launching the game directly in the browser on GitHub Pages.
- **Key Value**: Eliminates manual packaging steps while guaranteeing that every release has verified unit tests, synchronized 12-epoch SHA-256 integrity hashes, and downloadable native installers.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Developer Push / Tag Flow**: Pushing to `main` or pushing a tag (`v12.0.0`) triggers the GitHub Actions pipeline, which runs type-checks and unit tests, deploys the live WebGL PWA to GitHub Pages, builds the Android `.apk` and Windows `.exe` packages, and publishes them to the repository's GitHub Releases page.
  2. **Player Download & Install Flow**: On the Title Screen top utility bar, players can either install the PWA directly or open a **Download Native Releases (`دریافت نسخه اندروید APK و ویندوز EXE`)** modal linking directly to the repository's latest GitHub Release assets (`.apk`, `.exe`, `.zip`).
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Mature Dark-Epic Persian Miniature (`Obsidian Basalt`, `Burnished Gold`, `Arterial Crimson`, and `Lapis Lazuli`), keeping the release download modal consistent with the existing Settings and Scroll of Destiny modals.
  - *Color Palette & Mood*: Deep stone surfaces (`bg-stone-950/95`), burnished gold borders (`border-amber-600/70`), crimson action highlights (`bg-red-800`), and high-contrast amber typography (`text-amber-300`).
  - *Typography & Hierarchy*: `Vazirmatn` for Persian/Archaic Persian UI and `Cinzel` / `JetBrains Mono` for English titles, version tags, and SHA-256 checksum badges, strictly preserving 100% numeral and script separation (`۰-۹` vs. `0-9`).
  - *Component Styling & Layout*: Compact, zero-clutter modal dialog accessible from the Title Screen top utility strip without adding any extra cards to the main title view or combat HUD.
- **Interactive Feedback & Motion**: Clear platform badges for Android `.apk`, Windows `.exe`, and Offline `.zip` with direct download actions and keyboard `Escape` dismissal.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Native Packaging Strategy in CI (Capacitor for Android `.apk` + Electron for Windows `.exe`)**
  - *Chosen Approach*: Generate the core production bundle once (`npm run build`), then package `./dist` into an Android `.apk` using Capacitor + Android SDK/Gradle on the Ubuntu runner, and into a standalone Windows `.exe` executable using Electron packaging in CI.
  - *Why*: Uses the exact same verified WebGL/Three.js + Web Audio codebase across Web, Android, and Windows without maintaining separate native codebases, and runs entirely on standard GitHub-hosted Linux runners.
  - *Alternatives Considered*: Separate Windows/macOS runner matrices were passed over for the primary job to avoid slow multi-OS queue times and keep the entire release pipeline fast and self-contained on `ubuntu-24.04`.
- **Decision 2 — Automated Tagging on `main` Pushes**
  - *Chosen Approach*: When triggered by a push to `main` (without an explicit `v*` git tag), the workflow reads the version from the release manifest (`v12.0.0`) and updates or creates the release tag automatically via `softprops/action-gh-release`, ensuring every push to `main` produces fresh downloadable `.apk` and `.exe` binaries.
  - *Why*: Matches your requirement that releases be published on both `main` pushes and version tags without failing on duplicate tag names.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                   GitHub Push (main) / Tag (v*) / Dispatch                 │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                 1. Verify & Build Core WebGL PWA (ubuntu-24.04)            │
│  • TypeScript Typecheck & 12-Epoch Unit Tests                              │
│  • SHA-256 Release Manifest Generator                                      │
│  • Production Vite + Workbox Offline Bundle                                │
└───────────┬─────────────────────────────────┬──────────────────────────────┘
            │                                 │
            ▼                                 ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────────┐
│   2A. GitHub Pages Deployment     │ │  2B. Multi-Platform Native Packager  │
│  • Configure Pages & Upload Dist  │ │  • Android APK (Capacitor + Gradle)  │
│  • Publish Live WebGL PWA         │ │  • Windows EXE (Electron Standalone) │
│                                   │ │  • Linux/Web Portable Archives (.zip)│
│                                   │ │  • SHA256SUMS.txt & Release Notes    │
└───────────────────────────────────┘ └───────────────────┬──────────────────┘
                                                          │
                                                          ▼
                                      ┌──────────────────────────────────────┐
                                      │      3. GitHub Releases Publisher    │
                                      │  • Attaches .apk, .exe, .zip, JSON   │
                                      │  • Bilingual FA / EN Changelog       │
                                      └──────────────────────────────────────┘
```

### Data Model & State
- **Release Manifest (`version-manifest.json`)**: Stores the current semantic version (`12.0.0`), build timestamp, SHA-256 epoch integrity hash, and platform asset filenames (`androidApk`, `windowsExe`, `linuxTarGz`, `webZip`) so both the CI pipeline and in-app Release Download modal stay synchronized.
- **Desktop Wrapper Entry**: Minimal Electron main process script configured for full-screen/windowed hardware-accelerated WebGL rendering with zero external runtime dependencies.
- **Android Wrapper Config**: Capacitor configuration (`com.shahnameh.crownofash`) pointing to `./dist` with landscape orientation and full-screen immersive mode.

### Interactive Component & State Mapping
- **Title Screen Utility Bar**: Adds a clean download icon button (`دریافت نسخه‌ها` / `Releases`) next to the Settings button on the Title Screen.
- **Release Downloads Modal**: Opens on click, displaying the current version (`v12.0.0`), SHA-256 integrity badge, and direct download buttons for **Android (`.apk`)**, **Windows (`.exe`)**, and **Offline Web Bundle (`.zip`)** pointing to the repository's GitHub Releases `/releases/latest/download/...` endpoints, plus a `Close` (`Escape`) handler.
