# Shahnameh of Ferdowsi: Crown of Ash & Light
# شاهنامه فردوسی: تاج خاکستر و نور

**Shahnameh of Ferdowsi: Crown of Ash & Light** (`شاهنامه فردوسی: تاج خاکستر و نور`) is a dark-epic, adult-oriented 3D/2D Action-RPG and Hack & Slash web game spanning all **12 mythic, heroic, and historical epochs** of Hakim Abolqasem Ferdowsi's *Shahnameh*. Built as an installable, offline-capable Progressive Web App (PWA), it combines articulated WebGL combat, moral binary choices, full faction inversion, and vector-aligned arterial combat physics.

---

## Table of Contents
1. [Tech Stack](#1-tech-stack)
2. [Core Game Mechanics](#2-core-game-mechanics)
   - [The 12 Epochs of Shahnameh](#the-12-epochs-of-shahnameh)
   - [Moral Alignment System & Faction Inversion (Asha vs. Ahriman)](#moral-alignment-system--faction-inversion-asha-vs-ahriman)
   - [3-Phase Epoch Progression & 1v1 Boss Duels](#3-phase-epoch-progression--1v1-boss-duels)
   - [Combat System, Camera Modes & Arterial Gore Physics](#combat-system-camera-modes--arterial-gore-physics)
3. [Project Architecture](#3-project-architecture)
4. [Building, Testing & Running Locally](#4-building-testing--running-locally)
5. [Automated GitHub Pages Deployment](#5-automated-github-pages-deployment)
6. [مستندات جامع فارسی (Persian Documentation)](#6-مستندات-جامع-فارسی-persian-documentation)

---

## 1. Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) with TypeScript (`strict` modular architecture)
- **Build Tool & Bundler**: [Vite 8](https://vite.dev/) for instant dev server startup and optimized production bundles
- **Styling & UI Theme**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) styled with an Obsidian Basalt, Lapis Lazuli, Burnished Gold, and Arterial Crimson palette inspired by Tabriz/Herat Persian miniatures and Persepolis stone reliefs
- **3D / 2D Rendering Engine**: [Three.js](https://threejs.org/) (`WebGLRenderer` with procedural canvas textures, dynamic point/directional lighting, articulated multi-joint character hierarchies, and instant toggling between **3D Isometric Arena** and **2D Side-Scrolling Persian Miniature** views)
- **Progressive Web App (PWA)**: [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) + Workbox service worker (`registerType: 'autoUpdate'`) with precached assets, standalone Web App Manifest, custom SVG/PNG icons (`192x192`, `512x512`, maskable), and in-app install prompt
- **Procedural Audio Engine**: Native **Web Audio API** synthesizer generating real-time metallic sword clashes, heavy mace impacts, bowstring releases, war horns (`Karnay`), and Kus-e Harb war drums without external audio dependencies
- **Testing & Automation**: Native Node.js test runner (`node:test` via `tsx`) for deterministic unit testing of combat rules, moral alignment effects, and arterial blood physics, plus automated SHA-256 release manifest generation (`scripts/update-manifest.mjs`)

---

## 2. Core Game Mechanics

### The 12 Epochs of Shahnameh
Every epoch features bespoke character armor, crowns, capes, historical weapons, and environmental lighting:

| Epoch | Title | Path of Asha Champion (Light) | Path of Ahriman Warlord (Darkness) | Signature Visuals & Weapons |
| :--- | :--- | :--- | :--- | :--- |
| **I** | Keyumars & The Leopard Throne | King Keyumars | Khazarvan the Black Demon / Sorush | Leopard-skin mantle, white beard, First Crown, Stone Mace |
| **II** | Siamak's Vengeance on Mount Alborz | Prince Siamak | Spiteful Ahriman | Bare-chested warrior with leopard baldric & war headband |
| **III** | Hushang & The Discovery of Fire (Sadeh) | King Hushang | Khara the Fire-Eater Demon | Flaming Sadeh crown, flint fire-stone in left hand, blazing axe |
| **IV** | Tahmuras the Demon-Binder | Tahmuras Divband | Arzhang Div & Sorcerers | Lapis scale armor, golden lasso loop in left hand, steel mace |
| **V** | Jamshid, Zahhak & Kaveh's Uprising | Kaveh the Blacksmith | Zahhak the Serpent-Shouldered | Leather smith apron, heavy hammer, Derafsh Kaviani banner, twin black shoulder serpents |
| **VI** | Fereydun & The Ox-Headed Mace | Fereydun the Glorious | Azhi Dahaka of Damavand | Emerald-gold plate armor & horned Ox-Headed Mace (`Gorz-e Gavsar`) |
| **VII** | Zal, Simurgh & Rostam's Seven Labors | Rostam-e Dastan | The White Demon of Mazandaran | Tiger-striped *Babr-e Bayan* coat, forked beard, crimson Simurgh feather, millstone shield |
| **VIII** | The Tragedy of Rostam & Sohrab | Young Sohrab | Human of Turan / Rostam | Turquoise cuirass, youthful beardless visage, glowing *Mohreh* armlet |
| **IX** | Siavash's Ordeal of Sacred Fire | Prince Siavash | Afrasiab of Turan | Pure white & silver royal vestments surrounded by sacred flames |
| **X** | Rostam vs. The Brazen-Bodied Esfandiyar | Rostam (Chachi Bow) | Brazen-Bodied Esfandiyar | Twin-forked *Gaz* arrow blessed by Simurgh vs. full golden mask & armor |
| **XI** | Shaghad's Betrayal & The Spear-Pit of Kabul | Wounded Rostam | Shaghad the Oathbreaker | Arrows embedded in *Babr-e Bayan* armor vs. Shaghad behind the plane tree |
| **XII** | Rostam Farrokhzad, Ferdowsi & Immortality | Rostam Farrokhzad | Demon of Oblivion | Purple-gold Sassanid armor, Faravahar wings, Derafsh Kaviani & Hakim Ferdowsi |

### Moral Alignment System & Faction Inversion (`Asha` vs. `Ahriman`)
At any point before or during the campaign, and at every epoch's moral crossroads, the player chooses between two cosmic alignments:
1. **Path of Asha (`فروغ اشه` — Light, Order & Justice)**:
   - Play as the legendary heroes and kings of Iranshahr.
   - Enemy vanguard forces and the final 1v1 Boss are drawn from Ahriman's demonic legions and tyrants.
   - Righteous choices increase **Iranshahr Stability (`پایداری ایرانشهر`)** and shift **Farrah Alignment** toward pure light.
2. **Path of Ahriman (`خشم اهریمن` — Darkness, Chaos & Power)**:
   - **Full Faction Inversion**: The player embodies the demonic warlord or tyrant of that epoch (e.g., Khazarvan, Zahhak, White Demon, Afrasiab, Esfandiyar, Shaghad).
   - Enemy vanguard soldiers become Iranshahr's royal guards, and the final 1v1 Boss becomes the champion of Light (e.g., Sorush, Kaveh, Fereydun, Rostam, Siavash, or Ferdowsi).
   - Dark choices sacrifice kingdom stability in exchange for raw **Attack Power (`ضریب خشم`)** and unlock the dark-mythological ending.

### 3-Phase Epoch Progression & 1v1 Boss Duels
Each of the 12 epochs unfolds across three distinct stages:
1. **Phase 1 — Vanguard Skirmish**: Battle a wave of 5 vanguard warriors featuring three distinct AI archetypes:
   - *Rusher* (fast melee pressure)
   - *Ranged / Sorcerer* (maintains distance and launches projectiles)
   - *Heavy Guard* (high armor and crushing strikes)
2. **Phase 2 — The Scroll of Destiny (`طومار سرنوشت`)**: Once the vanguard falls, an ancient parchment scroll unfurls presenting the epoch's historical verse and a binary moral crossroads between **Asha** and **Ahriman**, permanently altering campaign stats.
3. **Phase 3 — 1v1 Boss Duel (`نبرد تن‌به‌تن باس`)**: The battlefield clears for a high-stakes 1v1 duel against the epoch's Boss, complete with a dedicated overhead Boss Health Bar, phase transitions, and finishing blows.

### Combat System, Camera Modes & Arterial Gore Physics
- **Controls**:
  - **Movement**: `W / A / S / D` or Arrow Keys (or the auto-detected **Mobile Virtual Joystick** on touch devices)
  - **Light Strike (`J` / `Space`)**: Fast combo slash or thrust
  - **Heavy Strike (`K`)**: High-damage, wide-arc cleaving blow (`Gorz` / Heavy Sword)
  - ** Kemand / Special (`L`)**: Golden Lasso pull, Simurgh fire burst, or twin-forked arrow shot (consumes Farrah energy)
  - **Dash / Dodge (`Shift`)**: Rapid evasive roll with invulnerability frames
- **Vector-Aligned Arterial Blood & Dismemberment**:
  - Weapon impacts spawn arterial blood droplets along the exact 3D strike vector with realistic gravitational acceleration, pooling into dark crimson decals on the Persepolis basalt arena floor.
  - Lethal heavy blows trigger limb/head dismemberment physics (configurable in Settings).
- **100% Language & Numeral Purity**:
  - Supports **Modern Persian (`فارسی`)**, **Archaic Shahnameh Persian (`پارسی کهن`)** with pure Persian numerals (`۰-۹`), and **English (`EN`)** with Latin numerals (`0-9`)—zero cross-language mixing.

---

## 3. Project Architecture

```text
├── .github/
│   ├── ISSUE_TEMPLATE/         # Bug report & epoch expansion templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Actions PWA build & GitHub Pages deployment
├── public/
│   ├── icon.svg                # Shahnameh royal crown vector emblem
│   ├── pwa-192x192.png         # PWA home-screen icon (192x192)
│   ├── pwa-512x512.png         # PWA splash & store icon (512x512)
│   ├── pwa-maskable-512x512.png# Maskable adaptive icon
│   └── version-manifest.json   # Automated release manifest with SHA-256 epoch integrity hash
├── scripts/
│   └── update-manifest.mjs     # CLI script to compute SHA-256 hash and update version-manifest.json
├── src/
│   ├── components/
│   │   ├── ArenaCanvas.tsx     # Three.js WebGL 3D/2D arena, combat loop, AI & gore particles
│   │   ├── DestinyScrollModal.tsx # Moral crossroads parchment modal (Asha vs. Ahriman)
│   │   ├── SettingsModal.tsx   # Live settings (Audio, Camera 3D/2D, Gore, Graphics, Language)
│   │   ├── TouchControls.tsx   # Responsive mobile virtual joystick & 4-button action pad
│   │   └── usePWAInstall.ts    # PWA beforeinstallprompt hook
│   ├── game/
│   │   ├── audio.ts            # Procedural Web Audio synthesizer
│   │   ├── characterBuilder.ts # Articulated 10-14 part 3D character builder & canvas textures
│   │   ├── epochs.ts           # Complete 12-Epoch dataset, visual traits & moral choices
│   │   ├── i18n.ts             # Pure localization dictionaries (fa, fa_old, en) & numeral formatter
│   │   ├── rules.ts            # Pure combat math, faction inversion, blood physics & moral engine
│   │   └── rules.test.ts       # Automated unit test suite (node:test)
│   ├── App.tsx                 # Main Game Shell, HUD, Epoch Selector & Victory/Defeat overlays
│   ├── index.css               # Tailwind CSS v4 imports & typography definitions
│   └── main.tsx                # Application entry point
└── vite.config.ts              # Vite + React + Tailwind + VitePWA configuration
```

---

## 4. Building, Testing & Running Locally

### Prerequisites
- **Node.js** `>= 20.x` (Node `22.x` recommended)
- **npm** `>= 10.x`

### Step-by-Step Commands

```bash
# 1. Install project dependencies
npm install

# 2. Start the local development server on http://localhost:3000
npm run dev

# 3. Run TypeScript static type checking
npm run lint

# 4. Run unit tests (verifies all 12 epochs, faction inversion, language purity & blood physics)
npm test

# 5. Update the automated release manifest (public/version-manifest.json)
npm run release:manifest

# 6. Build the production-ready PWA bundle into ./dist
npm run build

# 7. Run the full verification pipeline (lint + unit tests + manifest + production build)
npm run verify
```

---

## 5. Automated GitHub Pages Deployment

This repository includes a complete GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that automatically tests, builds, and deploys the Progressive Web App to **GitHub Pages** whenever changes are pushed to the `main` branch.

### How to Enable in Your GitHub Repository:
1. Push this repository to GitHub with `main` as your default branch.
2. In your GitHub repository, navigate to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Every push to `main` (or manual trigger via the **Actions** tab) will:
   - Run `npm run lint` and `npm test`
   - Update `public/version-manifest.json` via `npm run release:manifest`
   - Build the production PWA bundle (`npm run build`)
   - Publish `./dist` directly to your GitHub Pages URL.

---

## 6. مستندات جامع فارسی (Persian Documentation)

<div dir="rtl">

**«شاهنامه فردوسی: تاج خاکستر و نور»** یک بازی اکشن-نقش‌آفرینی و رزمی (Action-RPG / Hack & Slash) بزرگسالانه، تاریک و حماسی (Grimdark) بر پایه کل سیر اساطیری، پهلوانی و تاریخی **شاهنامه حکیم ابوالقاسم فردوسی** است که با پشته فنی `React 19`، `Vite 8`، `Tailwind CSS v4`، موتور گرافیکی `Three.js` و قابلیت نصب آفلاین (`PWA`) توسعه یافته است.

### ویژگی‌های برجسته
- **پوشش کامل هر ۱۲ عصر شاهنامه**: از پادشاهی کیومرث، رزم سیامک، جشن سده هوشنگ، طهمورث دیوبند و قیام کاوه آهنگر تا فریدون، هفت‌خوان رستم، تراژدی رستم و سهراب، گذر سیاوش از آتش، اسفندیار روئین‌تن، چاه شغاد و رستم فرخزاد در کنار حکیم فردوسی.
- **سیستم اخلاقی و وارونگی کامل جبهه‌ها (فروغ اشه در برابر خشم اهریمن)**:
  - با انتخاب **فروغ اشه (خیر)** در نقش پهلوانان ایرانشهر با سپاه دیوان می‌جنگید.
  - با انتخاب **خشم اهریمن (شر)** در نقش سردار اهریمنی هر عصر قرار می‌گیرید و سپاه دشمن و باس ۱ به ۱ پایانی به پهلوانان ایرانشهر تغییر می‌کنند.
- **طومار سرنوشت و نبرد تن‌به‌تن (1v1 Boss Duel)**: پس از درهم شکستن موج پیش‌قراولان، طومار سرنوشت باز شده و تصمیم شما بر پایداری ایرانشهر، فره ایزدی و قدرت ضربات اثر دائمی می‌گذارد؛ سپس نبرد تن‌به‌تن با باس آن عصر آغاز می‌شود.
- **فیزیک خون شریانی و قطع عضو**: پرتاب ذرات خون در امتداد بردار ضربه سلاح با شتاب گرانش، تشکیل حوضچه‌های خون روی سنگ‌فرش بازالت و قطع عضو در ضربات تمام‌کننده.
- **تفکیک ۱۰۰٪ زبان‌ها و ارقام**: پشتیبانی کامل از سه زبان **فارسی**، **پارسی کهن** (با ارقام فارسی `۰-۹`) و **انگلیسی** (با ارقام `0-9`).

### دستورات اجرا و بیلد

```bash
npm install        # نصب پکیج‌ها
npm run dev        # اجرای سرور توسعه روی پورت 3000
npm test           # اجرای تست‌های واحد منطق بازی
npm run verify     # بررسی تایپ‌ها، اجرای تست‌ها، بروزرسانی مانیفست و ساخت نسخه نهایی PWA
```

</div>
