export type Language = 'fa' | 'fa_old' | 'en';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Formats numbers strictly into Persian digits when language is 'fa' or 'fa_old',
 * and standard ASCII digits when language is 'en'.
 */
export function formatNum(value: number | string, lang: Language): string {
  const str = String(typeof value === 'number' ? Math.round(value) : value);
  if (lang === 'en') {
    return str.replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)));
  }
  return str.replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

export function formatDecimal(value: number, decimals: number, lang: Language): string {
  const fixed = value.toFixed(decimals);
  if (lang === 'en') return fixed;
  return fixed
    .replace('.', '٫')
    .replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

export interface UIDictionary {
  gameTitle: string;
  gameSubtitle: string;
  selectFaction: string;
  factionGoodName: string;
  factionGoodDesc: string;
  factionEvilName: string;
  factionEvilDesc: string;
  selectEpoch: string;
  startBattle: string;
  continueEpoch: string;
  settings: string;
  soundOn: string;
  soundOff: string;
  pause: string;
  resume: string;
  restartEpoch: string;
  returnToTitle: string;
  nextEpoch: string;
  tryAgain: string;
  installApp: string;
  hpLabel: string;
  farrLabelGood: string;
  farrLabelEvil: string;
  stabilityLabel: string;
  waveLabel: string;
  bossDuelLabel: string;
  destinyScrollTitle: string;
  destinyScrollSubtitle: string;
  choiceGoodTag: string;
  choiceEvilTag: string;
  victoryTitle: string;
  defeatTitle: string;
  clearTimeLabel: string;
  damageDealtLabel: string;
  alignmentScoreLabel: string;
  enemiesSlainLabel: string;
  controlsHintDesktop: string;
  controlsHintTouch: string;
  skillStrike: string;
  skillLasso: string;
  skillFireStone: string;
  skillDodge: string;
  settingsTitle: string;
  masterVolume: string;
  sfxVolume: string;
  musicVolume: string;
  graphicsQuality: string;
  qualityLow: string;
  qualityMedium: string;
  qualityHigh: string;
  qualityUltra: string;
  cameraMode: string;
  mode3D: string;
  mode2D: string;
  cameraShake: string;
  goreIntensity: string;
  goreLow: string;
  goreMedium: string;
  goreBrutal: string;
  difficulty: string;
  diffStory: string;
  diffHeroic: string;
  diffMythic: string;
  languageLabel: string;
  langFa: string;
  langFaOld: string;
  langEn: string;
  closeSettings: string;
  enabled: string;
  disabled: string;
  phaseVanguard: string;
  phaseCrossroads: string;
  phaseBossDuel: string;
  commanderRoleLabel: string;
  bossOpponentLabel: string;
  epochWord: string;
  loadingAssets: string;
  loadingSkip: string;
}

export const DICTIONARY: Record<Language, UIDictionary> = {
  fa: {
    gameTitle: 'شاهنامه فردوسی',
    gameSubtitle: 'تاج خاکستر و نور',
    selectFaction: 'انتخاب جبهه نبرد',
    factionGoodName: 'فروغ اشه (سپاه ایرانشهر)',
    factionGoodDesc: 'در نقش پهلوانان و پادشاهان ایرانشهر، در برابر دیوان و اهریمن بایستید.',
    factionEvilName: 'خشم اهریمن (سپاه تاریکی)',
    factionEvilDesc: 'در نقش سرداران دیو و اهریمن، علیه پهلوانان ایرانشهر و فره ایزدی بجنگید.',
    selectEpoch: 'انتخاب عصر شاهنامه (۱۲ عصر از آغاز تا جاودانگی)',
    startBattle: 'آغاز نبرد حماسی',
    continueEpoch: 'ادامه نبرد',
    settings: 'تنظیمات بازی',
    soundOn: 'صدای بازی فعال',
    soundOff: 'صدای بازی قطع',
    pause: 'توقف بازی',
    resume: 'ادامه نبرد',
    restartEpoch: 'آغاز دوباره این عصر',
    returnToTitle: 'بازگشت به تالار نخستین',
    nextEpoch: 'ورود به عصر بعدی',
    tryAgain: 'تلاش دوباره در میدان',
    installApp: 'نصب نسخه کامل بازی',
    hpLabel: 'جان پهلوان',
    farrLabelGood: 'فره ایزدی',
    farrLabelEvil: 'خشم اهریمن',
    stabilityLabel: 'پایداری ایرانشهر',
    waveLabel: 'موج پیش‌قراولان',
    bossDuelLabel: 'نبرد تن‌به‌تن پایانی (۱ در برابر ۱)',
    destinyScrollTitle: 'طومار سرنوشت و دوراهی اخلاقی',
    destinyScrollSubtitle: 'پیش از نبرد تن‌به‌تن با سالار میدان، سرنوشت این عصر را رقم بزنید:',
    choiceGoodTag: 'راه فروغ اشه (داد و روشنایی)',
    choiceEvilTag: 'راه خشم اهریمن (خون و چیرگی)',
    victoryTitle: 'پیروزی در رزمگاه شاهنامه',
    defeatTitle: 'فروافتادن در خاک و خون',
    clearTimeLabel: 'زمان نبرد (ثانیه)',
    damageDealtLabel: 'آسیب واردشده',
    alignmentScoreLabel: 'تراز فره و سرنوشت',
    enemiesSlainLabel: 'دشمنان வீழ்த்த‌شده',
    controlsHintDesktop: 'حرکت: کلیدهای جهت‌نما · ضربه سنگین: کلید فاصله · کمند زرین: کلید ۱ · آتش سده: کلید ۲ · جاخالی: کلید ۳ · توقف: کلید گریز',
    controlsHintTouch: 'با اهرم لمسی حرکت کنید و با دکمه‌های رزمی ضربه بزنید',
    skillStrike: 'ضربه سلاح',
    skillLasso: 'کمند دیوبند',
    skillFireStone: 'آتش سده',
    skillDodge: 'خیزش رزمی',
    settingsTitle: 'تنظیمات صدا، تصویر و نبرد',
    masterVolume: 'بلندی صدای کل',
    sfxVolume: 'افکت‌های ضربه و شمشیر',
    musicVolume: 'موسیقی حماسی متن',
    graphicsQuality: 'کیفیت پردازش تصویر',
    qualityLow: 'پایین',
    qualityMedium: 'متوسط',
    qualityHigh: 'بالا',
    qualityUltra: 'اولترا',
    cameraMode: 'زاویه و نمای دوربین',
    mode3D: 'سه‌بعدی (میدان ژرف)',
    mode2D: 'دوبعدی (نگارگری رزمی)',
    cameraShake: 'لرزش دوربین در ضربات سنگین',
    goreIntensity: 'شدت خون‌ریزی و قطع عضو',
    goreLow: 'ملایم',
    goreMedium: 'واقع‌گرایانه',
    goreBrutal: 'بزرگسالانه و خشن',
    difficulty: 'درجه سختی نبرد',
    diffStory: 'داستانی',
    diffHeroic: 'پهلوانی',
    diffMythic: 'اساطیری',
    languageLabel: 'زبان نوشتار بازی',
    langFa: 'فارسی',
    langFaOld: 'پارسی کهن',
    langEn: 'انگلیسی',
    closeSettings: 'بستن و ذخیره تنظیمات',
    enabled: 'فعال',
    disabled: 'غیرفعال',
    phaseVanguard: 'پاکسازی پیش‌قراولان',
    phaseCrossroads: 'طومار سرنوشت',
    phaseBossDuel: 'نبرد تن‌به‌تن ۱ به ۱',
    commanderRoleLabel: 'کاراکتر شما',
    bossOpponentLabel: 'حریف پایانی (۱ به ۱)',
    epochWord: 'عصر',
    loadingAssets: 'آماده‌سازی رزمگاه و طومارهای شاهنامه...',
    loadingSkip: 'ورود به تالار',
  },
  fa_old: {
    gameTitle: 'شاهنامه حکیم فردوسی',
    gameSubtitle: 'افسر خاکستر و فروغ یزدانی',
    selectFaction: 'گزینش لشکر و آیین رزم',
    factionGoodName: 'فروغ اشه (سپاه ایرانشهر)',
    factionGoodDesc: 'به سیمای یلان و شهریاران ایرانشهر، کمر به کین‌خواهی دیوان ببندید.',
    factionEvilName: 'خشم اهریمن (سپاه تیرگی)',
    factionEvilDesc: 'به سیمای دیوان و سالاران اهریمن، بر تخت و فره ایرانشهر بتازید.',
    selectEpoch: 'گزینش روزگار شاهنامه (۱۲ عصر از کیومرث تا فردوسی)',
    startBattle: 'دمیدن در کوس و آغاز رزم',
    continueEpoch: 'پی‌گیری پیکار',
    settings: 'آیین‌نامه و سازوبرگ',
    soundOn: 'خروش نبرد برقرار',
    soundOff: 'خاموشی خروش',
    pause: 'درنگ در پیکار',
    resume: 'بازگشت به رزمگاه',
    restartEpoch: 'نبرد دوباره در این روزگار',
    returnToTitle: 'بازگشت به ایوان نخستین',
    nextEpoch: 'گذر به روزگار پسین',
    tryAgain: 'خیزش دوباره از خاک',
    installApp: 'نصب جاودانه بر دستگاه',
    hpLabel: 'توش و جان یل',
    farrLabelGood: 'فره ایزدی',
    farrLabelEvil: 'خشم اهریمنی',
    stabilityLabel: 'پایندگی ایرانشهر',
    waveLabel: 'فوج طلایه‌داران',
    bossDuelLabel: 'رزم تن‌به‌تن سالاران (۱ در برابر ۱)',
    destinyScrollTitle: 'طومار بخت و دوراهی داد و بیداد',
    destinyScrollSubtitle: 'پیش از هماوردی تن‌به‌تن با سالار میدان، پیمان خویش را برگزینید:',
    choiceGoodTag: 'آیین اشه (داد و روشنایی)',
    choiceEvilTag: 'آیین اهریمن (خون و چیرگی)',
    victoryTitle: 'پیروزی و سرافرازی در رزمگاه',
    defeatTitle: 'نگونساری در خاک و خون',
    clearTimeLabel: 'درنگ پیکار (ثانیه)',
    damageDealtLabel: 'زخم‌های کاری',
    alignmentScoreLabel: 'تراز فره و بخت',
    enemiesSlainLabel: 'بدخواهان فروافتاده',
    controlsHintDesktop: 'پویش: کلیدهای جهت · گرز و تیغ: کلید فاصله · کمند زرین: کلید ۱ · آذر سده: کلید ۲ · خیزش: کلید ۳ · درنگ: کلید گریز',
    controlsHintTouch: 'با اهرم دست چپ بپویید و با نگین‌های دست راست تیغ بزنید',
    skillStrike: 'تیغ و گرز',
    skillLasso: 'کمند دیوبند',
    skillFireStone: 'آذر سده',
    skillDodge: 'خیزش جنگی',
    settingsTitle: 'سازوبرگ آوا، نما و خشونت رزم',
    masterVolume: 'خروش کل آواها',
    sfxVolume: 'چکاچاک تیغ و گرز',
    musicVolume: 'خنیا و کوس شاهوار',
    graphicsQuality: 'نگارگری و تابش',
    qualityLow: 'ساده',
    qualityMedium: 'میانه',
    qualityHigh: 'آراسته',
    qualityUltra: 'شاهوار',
    cameraMode: 'چشم‌انداز رزمگاه',
    mode3D: 'سه‌بعدی (نمای ژرف)',
    mode2D: 'دوبعدی (نگارگری تبریز)',
    cameraShake: 'لرزش زمین در کوبش گرز',
    goreIntensity: 'خون‌فشانی و دریدن تن',
    goreLow: 'اندک',
    goreMedium: 'طبیعی',
    goreBrutal: 'خون‌بار و بی‌امان',
    difficulty: 'سختی هماورد',
    diffStory: 'خُنیاگری',
    diffHeroic: 'پهلوانی',
    diffMythic: 'اساطیری',
    languageLabel: 'گویش نوشتار',
    langFa: 'فارسی',
    langFaOld: 'پارسی کهن',
    langEn: 'انگلیسی',
    closeSettings: 'پذرفتن و بازگشت',
    enabled: 'برقرار',
    disabled: 'خاموش',
    phaseVanguard: 'درهم‌شکستن طلایه‌داران',
    phaseCrossroads: 'طومار سرنوشت',
    phaseBossDuel: 'هماورد تن‌به‌تن ۱ به ۱',
    commanderRoleLabel: 'یل میدان (شما)',
    bossOpponentLabel: 'هماورد پایانی (۱ به ۱)',
    epochWord: 'روزگار',
    loadingAssets: 'آراستن رزمگاه و گشودن طومار شاهنامه...',
    loadingSkip: 'ورود به ایوان',
  },
  en: {
    gameTitle: 'SHAHNAMEH OF FERDOWSI',
    gameSubtitle: 'Crown of Ash & Light',
    selectFaction: 'Choose Your Allegiance',
    factionGoodName: 'Light of Asha (Champions of Iranshahr)',
    factionGoodDesc: 'Command the legendary heroes and kings of Persia against the legions of Ahriman.',
    factionEvilName: 'Wrath of Ahriman (Warlords of Darkness)',
    factionEvilDesc: 'Lead the demonic warlords and tyrants to crush the heroes of Iranshahr.',
    selectEpoch: 'Select Shahnameh Epoch (All 12 Mythic & Historical Eras)',
    startBattle: 'Enter the Battlefield',
    continueEpoch: 'Continue Campaign',
    settings: 'Game Settings',
    soundOn: 'Audio Unmuted',
    soundOff: 'Audio Muted',
    pause: 'Pause Game',
    resume: 'Resume Battle',
    restartEpoch: 'Restart Current Epoch',
    returnToTitle: 'Return to Title Throne',
    nextEpoch: 'Advance to Next Epoch',
    tryAgain: 'Rise Again in Battle',
    installApp: 'Install Game App',
    hpLabel: 'Vitality',
    farrLabelGood: 'Divine Farr',
    farrLabelEvil: 'Ahrimanic Wrath',
    stabilityLabel: 'Iranshahr Stability',
    waveLabel: 'Vanguard Wave',
    bossDuelLabel: '1v1 Boss Duel',
    destinyScrollTitle: 'Scroll of Destiny: Moral Crossroads',
    destinyScrollSubtitle: 'Before the 1v1 Boss Duel begins, seal the fate of this epoch:',
    choiceGoodTag: 'Path of Asha (Order & Light)',
    choiceEvilTag: 'Path of Ahriman (Blood & Dominion)',
    victoryTitle: 'Victory on the Field of Blood',
    defeatTitle: 'Fallen in Ash and Iron',
    clearTimeLabel: 'Clear Time (Sec)',
    damageDealtLabel: 'Damage Dealt',
    alignmentScoreLabel: 'Alignment Balance',
    enemiesSlainLabel: 'Foes Slain',
    controlsHintDesktop: 'WASD / Arrows Move · Space Heavy Strike · 1 Golden Lasso · 2 Sadeh Fire · 3 Dash Dodge · Esc Pause',
    controlsHintTouch: 'Use Left Virtual Stick to Move and Right Combat Buttons to Strike',
    skillStrike: 'Weapon Strike',
    skillLasso: 'Golden Lasso',
    skillFireStone: 'Sadeh Fire',
    skillDodge: 'Combat Dash',
    settingsTitle: 'Audio, Graphics & Combat Settings',
    masterVolume: 'Master Volume',
    sfxVolume: 'Combat & Gore SFX',
    musicVolume: 'Epic Score Volume',
    graphicsQuality: 'Render Quality',
    qualityLow: 'Low',
    qualityMedium: 'Medium',
    qualityHigh: 'High',
    qualityUltra: 'Ultra',
    cameraMode: 'Camera Perspective',
    mode3D: '3D Isometric Arena',
    mode2D: '2D Miniature Side-View',
    cameraShake: 'Impact Camera Shake',
    goreIntensity: 'Arterial Gore & Dismemberment',
    goreLow: 'Mild',
    goreMedium: 'Realistic',
    goreBrutal: 'Brutal Adult Gore',
    difficulty: 'Combat Difficulty',
    diffStory: 'Story',
    diffHeroic: 'Heroic',
    diffMythic: 'Mythic',
    languageLabel: 'Interface Language',
    langFa: 'Persian',
    langFaOld: 'Archaic Persian',
    langEn: 'English',
    closeSettings: 'Save & Close',
    enabled: 'Enabled',
    disabled: 'Disabled',
    phaseVanguard: 'Vanguard Clash',
    phaseCrossroads: 'Scroll of Destiny',
    phaseBossDuel: '1v1 Boss Duel',
    commanderRoleLabel: 'Your Champion',
    bossOpponentLabel: '1v1 Boss Opponent',
    epochWord: 'Epoch',
    loadingAssets: 'Forging the Arena & Unfurling the Scrolls of Shahnameh...',
    loadingSkip: 'Enter Hall',
  },
};
