import { Language } from './i18n';

export type Faction = 'asha' | 'ahriman';

export type VisualArchetypeId =
  | 'keyumars'
  | 'khazarvan_div'
  | 'sorush_angel'
  | 'siamak'
  | 'ahriman_champion'
  | 'hushang'
  | 'khara_div'
  | 'tahmuras'
  | 'arzhang_div'
  | 'kaveh'
  | 'zahhak'
  | 'fereydun'
  | 'azhidahak_dragon'
  | 'rostam_babr'
  | 'div_sepid'
  | 'sohrab'
  | 'turan_warlord'
  | 'siavash'
  | 'afrasiab'
  | 'rostam_chachi'
  | 'esfandiyar'
  | 'rostam_wounded'
  | 'shaghad'
  | 'rostam_farrokhzad'
  | 'oblivion_div';

export interface CharacterVisualSpec {
  id: VisualArchetypeId;
  name: Record<Language, string>;
  title: Record<Language, string>;
  primaryColor: number;
  secondaryColor: number;
  accentColor: number;
  skinColor: number;
  armorStyle:
    | 'leopard_fur'
    | 'bare_sash'
    | 'sadeh_flame'
    | 'lapis_scale'
    | 'blacksmith_apron'
    | 'serpent_shoulders'
    | 'emerald_royal'
    | 'babr_bayan'
    | 'chalk_giant'
    | 'turquoise_youth'
    | 'sacred_white'
    | 'golden_brazen'
    | 'wounded_babr'
    | 'sassanian_purple'
    | 'obsidian_demon';
  weaponStyle:
    | 'stone_mace'
    | 'dark_cleaver'
    | 'fire_axe'
    | 'steel_mace_lasso'
    | 'smith_hammer'
    | 'twin_fangs'
    | 'bull_mace'
    | 'millstone'
    | 'persian_shamshir'
    | 'chachi_bow_tamarisk'
    | 'golden_twin_blades'
    | 'sassanian_lance';
  specialTrait:
    | 'white_beard_crown'
    | 'golden_wings'
    | 'headband'
    | 'left_fire_orb'
    | 'left_golden_lasso'
    | 'derafsh_kaviani'
    | 'shoulder_serpents'
    | 'simorgh_feather'
    | 'tahmineh_armlet'
    | 'sacred_fire_halo'
    | 'golden_visored_mask'
    | 'embedded_arrows'
    | 'faravahar_wings'
    | 'horned_skull';
  scale: number;
}

export interface MoralCrossroads {
  prompt: Record<Language, string>;
  ashaChoice: {
    title: Record<Language, string>;
    consequence: Record<Language, string>;
    stabilityDelta: number;
    farrDelta: number;
    attackMultiplierBonus: number;
  };
  ahrimanChoice: {
    title: Record<Language, string>;
    consequence: Record<Language, string>;
    stabilityDelta: number;
    farrDelta: number;
    attackMultiplierBonus: number;
  };
}

export interface EpochData {
  id: number;
  versionTag: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  loreIntro: Record<Language, string>;
  environmentTheme: {
    id: string;
    skyColor: number;
    fogColor: number;
    floorTint: number;
    torchColor: number;
    hasPlaneTree?: boolean;
    hasSpearPit?: boolean;
    hasRingOfFire?: boolean;
    hasDamavandLava?: boolean;
  };
  /** When player selects Good (Asha): player is goodHero, boss is evilBoss */
  goodHero: CharacterVisualSpec;
  evilBoss: CharacterVisualSpec;
  /** When player selects Evil (Ahriman): player is evilCommander, boss is goodBoss */
  evilCommander: CharacterVisualSpec;
  goodBoss: CharacterVisualSpec;
  vanguardNameGood: Record<Language, string>;
  vanguardNameEvil: Record<Language, string>;
  crossroads: MoralCrossroads;
}

export const SHAHNAMEH_EPOCHS: EpochData[] = [
  // ============================================================================
  // EPOCH 1: KEYUMARS & THE LEOPARD THRONE OF ALBORZ
  // ============================================================================
  {
    id: 1,
    versionTag: '۱.۰',
    title: {
      fa: 'عصر اول: پادشاهی کیومرث و تخت پلنگینه البرز',
      fa_old: 'روزگار نخست: شهریاری کیومرث بر چکاد البرز',
      en: 'Epoch I: Keyumars & The Leopard Throne of Alborz',
    },
    subtitle: {
      fa: 'نخستین تاجدار جهان در برابر خزروان دیو سیاه',
      fa_old: 'نخستین خدیو گیتی در برابر خزروان دیو تیره',
      en: 'The First Mortal King Against Khazarvan the Black Div',
    },
    loreIntro: {
      fa: 'کیومرث بر فراز کوه البرز نخستین آیین شاهی را نهاد و پوشش پلنگینه بر تن کرد؛ اما اهریمن از رشک، خزروان دیو سیاه را برای تباهی جهان برانگیخت.',
      fa_old: 'کیومرث بر تیغ البرزکوه نخستین اورنگ شهریاری را پی افکند؛ لیکن اهریمن کینه‌جوی، خزروان دیو را به نابودی فره ایزدی گسیل داشت.',
      en: 'Atop Mount Alborz, Keyumars established the first mortal kingship clad in leopard pelt, awakening the envy of Ahriman and his warlord Khazarvan.',
    },
    environmentTheme: {
      id: 'alborz_summit',
      skyColor: 0x0b0d14,
      fogColor: 0x121521,
      floorTint: 0x262936,
      torchColor: 0xf59e0b,
    },
    goodHero: {
      id: 'keyumars',
      name: { fa: 'کیومرث شاه', fa_old: 'کیومرث پیشدادی', en: 'King Keyumars' },
      title: { fa: 'نخستین شهریار پلنگینه‌پوش البرز', fa_old: 'خدیو پلنگینه‌پوش البرزکوه', en: 'First Monarch of the Leopard Throne' },
      primaryColor: 0xd97706,
      secondaryColor: 0x78350f,
      accentColor: 0xfef3c7,
      skinColor: 0xd6b496,
      armorStyle: 'leopard_fur',
      weaponStyle: 'stone_mace',
      specialTrait: 'white_beard_crown',
      scale: 1.05,
    },
    evilBoss: {
      id: 'khazarvan_div',
      name: { fa: 'خزروان دیو سیاه', fa_old: 'خزروان دیو تیره‌روان', en: 'Khazarvan the Black Div' },
      title: { fa: 'سپهبد اهریمن در کوه البرز', fa_old: 'سالار دژخیمان اهریمن', en: 'Arch-Fiend of the Alborz Abyss' },
      primaryColor: 0x18181b,
      secondaryColor: 0x7f1d1d,
      accentColor: 0xef4444,
      skinColor: 0x27272a,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.38,
    },
    evilCommander: {
      id: 'khazarvan_div',
      name: { fa: 'خزروان دیو سیاه', fa_old: 'خزروان دیو تیره‌روان', en: 'Khazarvan the Black Div' },
      title: { fa: 'فرمانده سپاه اهریمن', fa_old: 'سالار لشکر اهریمن', en: 'Vanguard Warlord of Ahriman' },
      primaryColor: 0x18181b,
      secondaryColor: 0x991b1b,
      accentColor: 0xef4444,
      skinColor: 0x27272a,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.15,
    },
    goodBoss: {
      id: 'sorush_angel',
      name: { fa: 'کیومرث و سروش ایزدی', fa_old: 'کیومرث و سروش زرین‌بال', en: 'Keyumars & Divine Sorush' },
      title: { fa: 'پاسدار تخت پلنگینه و فرشته وحی', fa_old: 'نگهبان فره ایزدی بر چکاد البرز', en: 'Golden-Winged Herald & The First King' },
      primaryColor: 0xfbbf24,
      secondaryColor: 0xd97706,
      accentColor: 0xfef08a,
      skinColor: 0xe5c2a3,
      armorStyle: 'leopard_fur',
      weaponStyle: 'stone_mace',
      specialTrait: 'golden_wings',
      scale: 1.32,
    },
    vanguardNameGood: {
      fa: 'نگهبانان پلنگینه‌پوش البرز',
      fa_old: 'پاسداران البرزکوه',
      en: 'Leopard-Clad Wardens of Alborz',
    },
    vanguardNameEvil: {
      fa: 'دیوان سیاه خزروان',
      fa_old: 'دیوان دژخیم اهریمن',
      en: 'Shadow Fiends of Khazarvan',
    },
    crossroads: {
      prompt: {
        fa: 'دیوان شکست‌خورده در پای تخت البرز به زانو درآمده‌اند. سروش ایزدی فرمان به پیمان روشنایی می‌دهد و ندای اهریمن تو را به قربانی کردن اسیران در آتش خشم می‌خواند.',
        fa_old: 'دیوان نگونسار در پای اورنگ پلنگینه بر خاک افتاده‌اند. آیا آیین اشه و پیمان روشنایی را می‌گزینی یا خون ایشان را به آیین اهریمن بر سنگ می‌فشانی؟',
        en: 'The vanguard lies broken beneath the cliffs of Alborz. Do you consecrate the mountain in the covenant of Asha, or sacrifice the fallen to fuel Ahrimanic wrath?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: برافروختن آتش پیمان و داد', fa_old: 'آیین اشه: پاسداشت فره ایزدی', en: 'Path of Asha: Consecrate the Sacred Hearth' },
        consequence: { fa: 'پایداری ایرانشهر و فره ایزدی افزایش یافت', fa_old: 'فره ایزدی و پایندگی ایرانشهر فزونی یافت', en: 'Iranshahr Stability and Divine Farr increased' },
        stabilityDelta: 12,
        farrDelta: 25,
        attackMultiplierBonus: 0.18,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: خون‌افشانی بر صخره‌های البرز', fa_old: 'آیین اهریمن: قربانی در کام تاریکی', en: 'Path of Ahriman: Blood Sacrifice on Basalt' },
        consequence: { fa: 'قدرت ضربات مرگبارتر شد اما پایداری ایرانشهر کاهش یافت', fa_old: 'زور بازو فزونی یافت لیکن ایرانشهر لرزان گشت', en: 'Lethal strike power surged at the cost of Iranshahr Stability' },
        stabilityDelta: -14,
        farrDelta: -25,
        attackMultiplierBonus: 0.32,
      },
    },
  },

  // ============================================================================
  // EPOCH 2: SIAMAK'S VENGEANCE AT MOUNT ALBORZ
  // ============================================================================
  {
    id: 2,
    versionTag: '۲.۰',
    title: {
      fa: 'عصر دوم: رزم سیامک و کین‌خواهی در البرزکوه',
      fa_old: 'روزگار دوم: رزم سیامک و کین‌خواهی در البرز',
      en: 'Epoch II: Siamak & The Blood Feud of Alborz',
    },
    subtitle: {
      fa: 'پسر جوان کیومرث با تن برهنه و حمایل پلنگینه در برابر اهریمن کینه‌توز',
      fa_old: 'سیامک جوان با حمایل پلنگینه در برابر سالار دیوان',
      en: 'The Bare-Chested Prince Against the Wrathful Arch-Demon',
    },
    loreIntro: {
      fa: 'سیامک با تنی نیرومند، حمایل پلنگینه و سربند رزمی به میدان شتافت تا یک‌تنه با دیو اهریمنی پنجه دراندازد و سرنوشت دودمان پیشدادی را رقم بزند.',
      fa_old: 'سیامک دلیر بی‌جوشن و زره، تنها با حمایل پلنگینه و سربند شاهوار به آوردگاه شتافت تا کین پدر از سپاه اهریمن بستاند.',
      en: 'Disdaining heavy iron mail, Prince Siamak marches into the gorge wearing only a leopard sash and war-headband to clash with Ahriman’s champion.',
    },
    environmentTheme: {
      id: 'alborz_gorge',
      skyColor: 0x140b0b,
      fogColor: 0x1f1111,
      floorTint: 0x2c2220,
      torchColor: 0xea580c,
    },
    goodHero: {
      id: 'siamak',
      name: { fa: 'شاهزاده سیامک', fa_old: 'سیامک کیومرث', en: 'Prince Siamak' },
      title: { fa: 'یل جوان البرز با حمایل پلنگینه', fa_old: 'پور دلیر کیومرث با سربند رزم', en: 'Young Champion of the Leopard Sash' },
      primaryColor: 0xb45309,
      secondaryColor: 0x991b1b,
      accentColor: 0xfbbf24,
      skinColor: 0xd4a373,
      armorStyle: 'bare_sash',
      weaponStyle: 'stone_mace',
      specialTrait: 'headband',
      scale: 1.02,
    },
    evilBoss: {
      id: 'ahriman_champion',
      name: { fa: 'اهریمن کینه‌توز (دیو درنده)', fa_old: 'اهریمن کینه‌توز البرز', en: 'Wrathful Claw of Ahriman' },
      title: { fa: 'درنده سیاه‌چنگال تاریکی', fa_old: 'دیو جان‌ستان سیاه‌چنگ', en: 'The Heart-Rending Demon Warlord' },
      primaryColor: 0x3f0d12,
      secondaryColor: 0x09090b,
      accentColor: 0xdc2626,
      skinColor: 0x1c1917,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'twin_fangs',
      specialTrait: 'horned_skull',
      scale: 1.4,
    },
    evilCommander: {
      id: 'ahriman_champion',
      name: { fa: 'اهریمن کینه‌توز', fa_old: 'دیو کینه‌توز اهریمن', en: 'Wrathful Claw of Ahriman' },
      title: { fa: 'کشنده شاهزادگان پیشدادی', fa_old: 'درنده تخمه کیومرث', en: 'Slayer of the Pishdadian Line' },
      primaryColor: 0x3f0d12,
      secondaryColor: 0x09090b,
      accentColor: 0xdc2626,
      skinColor: 0x1c1917,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'twin_fangs',
      specialTrait: 'horned_skull',
      scale: 1.16,
    },
    goodBoss: {
      id: 'siamak',
      name: { fa: 'شاهزاده سیامک دلیر', fa_old: 'سیامک فرهمند', en: 'Prince Siamak the Undaunted' },
      title: { fa: 'وارث تاج پلنگینه ایرانشهر', fa_old: 'چراغ دودمان کیومرث', en: 'Heir to the Throne of Alborz' },
      primaryColor: 0xd97706,
      secondaryColor: 0x991b1b,
      accentColor: 0xfde047,
      skinColor: 0xd4a373,
      armorStyle: 'bare_sash',
      weaponStyle: 'stone_mace',
      specialTrait: 'headband',
      scale: 1.28,
    },
    vanguardNameGood: {
      fa: 'یاران وفادار سیامک',
      fa_old: 'گردن‌کشان سیامک',
      en: 'Sworn Companions of Siamak',
    },
    vanguardNameEvil: {
      fa: 'درندگان سیاه‌چنگ اهریمن',
      fa_old: 'دژخیمان خون‌خوار دیو',
      en: 'Black-Clawed Ravagers of Ahriman',
    },
    crossroads: {
      prompt: {
        fa: 'در تنگه خونین البرز، بانگ رجز دیو بزرگ به گوش می‌رسد. آیا با سپر فره ایزدی به مصاف او می‌روی یا با خشم کور و زخم‌های خون‌آلود تن به تن می‌دهی؟',
        fa_old: 'در گذرگاه خونین البرز، نعره دیو کینه‌توز کوه را می‌لرزاند. کدامین راه را برمی‌گزینی؟',
        en: 'In the blood-soaked defile of Alborz, the arch-demon roars its challenge. Will you stand in disciplined righteous fury or embrace reckless bloodlust?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: نیایش با سروش و پایداری در رزم', fa_old: 'آیین اشه: پیمان با سروش فرهمند', en: 'Path of Asha: Invoke the Shield of Sorush' },
        consequence: { fa: 'فره ایزدی و پایداری ایرانشهر تقویت شد', fa_old: 'فره ایزدی فزونی یافت', en: 'Divine protection and realm stability strengthened' },
        stabilityDelta: 10,
        farrDelta: 22,
        attackMultiplierBonus: 0.16,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: جنون خون و دریدن بی‌امان', fa_old: 'آیین اهریمن: خشم خون‌آشام', en: 'Path of Ahriman: Unbridled Blood Frenzy' },
        consequence: { fa: 'ضربات سهمگین‌تر شد اما فره ایزدی کاسته گشت', fa_old: 'ضربت گران‌تر گشت و فره کاستی گرفت', en: 'Brutal damage surge at the cost of sacred grace' },
        stabilityDelta: -12,
        farrDelta: -22,
        attackMultiplierBonus: 0.3,
      },
    },
  },

  // ============================================================================
  // EPOCH 3: HUSHANG, DISCOVERY OF FIRE & FEAST OF SADEH
  // ============================================================================
  {
    id: 3,
    versionTag: '۳.۰',
    title: {
      fa: 'عصر سوم: هوشنگ، کشف آتش و جشن سده',
      fa_old: 'روزگار سوم: هوشنگ پیشدادی و فروغ جشن سده',
      en: 'Epoch III: Hushang, Discovery of Fire & Feast of Sadeh',
    },
    subtitle: {
      fa: 'تاج شعله‌ور سده، گوی سنگ آتش‌زا و تبر آذرگون در برابر دیو خارا',
      fa_old: 'افسر آتشین سده و تبر آذرگون در برابر دیو خارا',
      en: 'The Blazing Crown of Sadeh Against Khara the Basalt Demon',
    },
    loreIntro: {
      fa: 'هوشنگ از برخورد دو سنگ سیاه بر دامنه کوه، فروغ آتش را کشف کرد، آهن را از سنگ بیرون کشید و با تبر آذرگون و گوی آتش سده به جنگ دیو خارا رفت.',
      fa_old: 'هوشنگ خردمند از کوبش سنگ بر سنگ، فروغ یزدانی آتش را پدید آورد، جشن سده بنیان نهاد و با تبر آذرگون به کین سیامک برخاست.',
      en: 'Striking dark flint against mountain rock, King Hushang birthed the sacred flame of Sadeh and forged the first iron weapons to avenge his father Siamak.',
    },
    environmentTheme: {
      id: 'sadeh_fire_peak',
      skyColor: 0x1a0905,
      fogColor: 0x2b1008,
      floorTint: 0x331d17,
      torchColor: 0xff5500,
    },
    goodHero: {
      id: 'hushang',
      name: { fa: 'هوشنگ شاه', fa_old: 'هوشنگ پیشدادی', en: 'King Hushang' },
      title: { fa: 'بنیان‌گذار جشن سده و آهنگر نخستین', fa_old: 'شهریار آتش‌افروز جشن سده', en: 'Lord of the Sadeh Flame & First Smith' },
      primaryColor: 0xea580c,
      secondaryColor: 0x9a3412,
      accentColor: 0xfde047,
      skinColor: 0xd6b496,
      armorStyle: 'sadeh_flame',
      weaponStyle: 'fire_axe',
      specialTrait: 'left_fire_orb',
      scale: 1.06,
    },
    evilBoss: {
      id: 'khara_div',
      name: { fa: 'دیو خارا و اهریمن آتش‌خوار', fa_old: 'دیو خارا و اژدهای دوددم', en: 'Khara the Basalt Fire-Eater Div' },
      title: { fa: 'غول سنگدل صخره‌های سیاه', fa_old: 'دیو سنگ‌پیکر کوهسار تیره', en: 'Colossus of Black Flint and Smoke' },
      primaryColor: 0x27272a,
      secondaryColor: 0x7c2d12,
      accentColor: 0xf97316,
      skinColor: 0x3f3f46,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'stone_mace',
      specialTrait: 'horned_skull',
      scale: 1.42,
    },
    evilCommander: {
      id: 'khara_div',
      name: { fa: 'دیو خارا آتش‌خوار', fa_old: 'دیو خارا دودافکن', en: 'Khara the Fire-Eater Div' },
      title: { fa: 'خاموش‌کننده آتشکده‌های سده', fa_old: 'دشمن فروغ سده', en: 'Quencher of the Sacred Sadeh Fires' },
      primaryColor: 0x27272a,
      secondaryColor: 0x7c2d12,
      accentColor: 0xf97316,
      skinColor: 0x3f3f46,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'stone_mace',
      specialTrait: 'horned_skull',
      scale: 1.18,
    },
    goodBoss: {
      id: 'hushang',
      name: { fa: 'هوشنگ شاه آتش‌افروز', fa_old: 'هوشنگ خداوندگار سده', en: 'King Hushang of the Blazing Crown' },
      title: { fa: 'دارنده گوی آتشین سده و تبر آذرگون', fa_old: 'شهریار تاج شعله‌ور سده', en: 'Wielder of the Sadeh Fire-Stone & Crimson Axe' },
      primaryColor: 0xf97316,
      secondaryColor: 0xb45309,
      accentColor: 0xfef08a,
      skinColor: 0xd6b496,
      armorStyle: 'sadeh_flame',
      weaponStyle: 'fire_axe',
      specialTrait: 'left_fire_orb',
      scale: 1.3,
    },
    vanguardNameGood: {
      fa: 'آهنگران و مشعل‌داران سده',
      fa_old: 'آذرپادان جشن سده',
      en: 'Torchbearers & Iron-Smiths of Sadeh',
    },
    vanguardNameEvil: {
      fa: 'دیوان دود و خاکستر خارا',
      fa_old: 'دیوان خاکسترنشین خارا',
      en: 'Ash & Basalt Fiends of Khara',
    },
    crossroads: {
      prompt: {
        fa: 'آتش سده بر فراز کوه شعله کشیده است. آیا این آتش را برای آبادانی ایرانشهر و روشنی شب مردمان به کار می‌گیری یا کوهستان را به دوزخی از خاکستر برای دشمنانت بدل می‌کنی؟',
        fa_old: 'فروغ سده بر چکاد کوه زبانه می‌کشد. آیا آتش را مایه آبادانی ایرانشهر می‌سازی یا دوزخی سوزان بر سر بدخواهان فرو می‌ریزی؟',
        en: 'The great bonfire of Sadeh roars against the night. Will you gift the sacred flame to warm and civilize Iranshahr, or unleash a wildfire of ash to incinerate all foes?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: وقف آتش سده برای آبادانی ایرانشهر', fa_old: 'آیین اشه: افروختن آتشکده‌های داد', en: 'Path of Asha: Gift Sacred Fire to the Realm' },
        consequence: { fa: 'پایداری ایرانشهر شکوفا شد و فره ایزدی فزونی یافت', fa_old: 'آبادانی ایرانشهر و فره ایزدی بالا گرفت', en: 'Iranshahr flourished and Divine Farr surged' },
        stabilityDelta: 15,
        farrDelta: 25,
        attackMultiplierBonus: 0.18,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: سوزاندن دشت و کوه در طوفان آتش', fa_old: 'آیین اهریمن: دوزخ خاکستر و خون', en: 'Path of Ahriman: Scorch the Earth in Hellfire' },
        consequence: { fa: 'تبر آذرگون قدرت ویرانگر یافت اما پایداری کشور آسیب دید', fa_old: 'تیغ آتشین سوزان‌تر گشت و بوم و بر سوخت', en: 'Devastating fire damage unlocked at heavy cost to the land' },
        stabilityDelta: -15,
        farrDelta: -25,
        attackMultiplierBonus: 0.34,
      },
    },
  },

  // ============================================================================
  // EPOCH 4: TAHMURAS THE DEMON-BINDER & THE GOLDEN LASSO
  // ============================================================================
  {
    id: 4,
    versionTag: '۴.۰',
    title: {
      fa: 'عصر چهارم: طهمورث دیوبند و راز کمند زرین',
      fa_old: 'روزگار چهارم: طهمورث دیوبند و کمند زرین',
      en: 'Epoch IV: Tahmuras the Demon-Binder & The Golden Lasso',
    },
    subtitle: {
      fa: 'زره فلس‌دار لاجوردی و کمند زرین در برابر ارژنگ دیو و جادوگران',
      fa_old: 'جوشن لاجوردین و کمند زرین در برابر ارژنگ دیو',
      en: 'Lapis Scale Mail & Golden Lasso Against Arzhang Div',
    },
    loreIntro: {
      fa: 'طهمورث دیوبند با زره فلس‌دار لاجوردی، تاج کنگره‌دار، کمند زرین در دست چپ و گرز پولادین، دو ثلث دیوان را به بند کشید و از آنان راز خط و نوشتن را آموخت.',
      fa_old: 'طهمورث دیوبند با جوشن فلس‌دار لاجوردین و کمند زرین، اهریمن را چون بارگی به زیر زین کشید و دیوان را به بند فرمان درآورد.',
      en: 'Clad in lapis lazuli scale armor and a crenellated crown, Tahmuras wields the Golden Lasso and steel mace to bind the demon legions of Arzhang.',
    },
    environmentTheme: {
      id: 'lapis_citadel',
      skyColor: 0x070d19,
      fogColor: 0x0e172a,
      floorTint: 0x1e293b,
      torchColor: 0x38bdf8,
    },
    goodHero: {
      id: 'tahmuras',
      name: { fa: 'طهمورث دیوبند', fa_old: 'طهمورث دیوبند پیشدادی', en: 'Tahmuras the Demon-Binder' },
      title: { fa: 'دارنده زره لاجوردی و کمند زرین', fa_old: 'شهریار کمندافکن و دیوبند', en: 'Sovereign of the Lapis Mail & Golden Lasso' },
      primaryColor: 0x1d4ed8,
      secondaryColor: 0x1e3a8a,
      accentColor: 0xfbbf24,
      skinColor: 0xd6b496,
      armorStyle: 'lapis_scale',
      weaponStyle: 'steel_mace_lasso',
      specialTrait: 'left_golden_lasso',
      scale: 1.07,
    },
    evilBoss: {
      id: 'arzhang_div',
      name: { fa: 'ارژنگ دیو و سالار جادوان', fa_old: 'ارژنگ دیو افسونگر', en: 'Arzhang Div the Arch-Sorcerer' },
      title: { fa: 'سردار دیوان سیاه و افسونگران شب', fa_old: 'سپهبد جادوان و دیوان تیره', en: 'Warlord of the Black Coven' },
      primaryColor: 0x311042,
      secondaryColor: 0x111827,
      accentColor: 0xa855f7,
      skinColor: 0x2e1065,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.4,
    },
    evilCommander: {
      id: 'arzhang_div',
      name: { fa: 'ارژنگ دیو افسونگر', fa_old: 'ارژنگ سالار جادوان', en: 'Arzhang Div the Sorcerer' },
      title: { fa: 'گسلنده کمند طهمورث', fa_old: 'شکننده بند پیشدادیان', en: 'Breaker of the Golden Fetters' },
      primaryColor: 0x311042,
      secondaryColor: 0x111827,
      accentColor: 0xa855f7,
      skinColor: 0x2e1065,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.16,
    },
    goodBoss: {
      id: 'tahmuras',
      name: { fa: 'طهمورث دیوبند', fa_old: 'طهمورث شهریار دیوبند', en: 'King Tahmuras the Demon-Binder' },
      title: { fa: 'شهریار زره لاجوردی و گرز پولادین', fa_old: 'خداوندگار کمند زرین و گرز گران', en: 'Master of the Golden Lasso & Steel Mace' },
      primaryColor: 0x2563eb,
      secondaryColor: 0x1e40af,
      accentColor: 0xfde047,
      skinColor: 0xd6b496,
      armorStyle: 'lapis_scale',
      weaponStyle: 'steel_mace_lasso',
      specialTrait: 'left_golden_lasso',
      scale: 1.32,
    },
    vanguardNameGood: {
      fa: 'سواران کمندانداز لاجوردپوش',
      fa_old: 'کمندافکنان طهمورث',
      en: 'Lapis-Armored Lasso Knights',
    },
    vanguardNameEvil: {
      fa: 'جادوگران و دیوان ارژنگ',
      fa_old: 'افسونگران و دیوان ارژنگ',
      en: 'Warlocks & Fiends of Arzhang',
    },
    crossroads: {
      prompt: {
        fa: 'دیوان در حلقه کمند زرین اسیر شده‌اند و در برابر زنهار، راز نوشتن سی خط و دانش نهان را پیشکش می‌کنند. آیا زنهار می‌دهی و دانش را می‌آموزی یا همگی را با گرز پولادین درهم می‌کوبی؟',
        fa_old: 'دیوان دربند، راز دبیره و نوشتن را بهای جان خویش می‌نهند. آیا دانش را برمی‌گزینی یا سرهای ایشان را زیر گرز پولادین می‌سایی؟',
        en: 'Bound in your Golden Lasso, the captive demons offer the secret art of writing thirty scripts in exchange for their lives. Do you accept wisdom or crush their skulls?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: پذیرش راز خط و دانش برای ایرانشهر', fa_old: 'آیین اشه: آموختن دبیره و خرد', en: 'Path of Asha:Spare Captives & Claim the Art of Script' },
        consequence: { fa: 'خرد و پایداری ایرانشهر به اوج رسید', fa_old: 'فرهنگ و پایندگی ایرانشهر فزونی گرفت', en: 'Realm wisdom and stability soared across Iranshahr' },
        stabilityDelta: 18,
        farrDelta: 25,
        attackMultiplierBonus: 0.16,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: خرد کردن جمجمه دیوان و تسخیر جادوی سیاه', fa_old: 'آیین اهریمن: کوفتن سر دیوان و تاراج افسون', en: 'Path of Ahriman: Execute Captives & Seize Dark Sorcery' },
        consequence: { fa: 'قدرت کمند و گرز مرگبار شد اما فره ایزدی تیره گشت', fa_old: 'گرز پولادین خون‌ریزتر شد و فره کاستی گرفت', en: 'Forbidden sorcery empowered your strikes at the cost of Farr' },
        stabilityDelta: -14,
        farrDelta: -25,
        attackMultiplierBonus: 0.35,
      },
    },
  },

  // ============================================================================
  // EPOCH 5: JAMSHID, ZAHHAK THE SERPENT-SHOULDERED & KAVEH'S UPRISING
  // ============================================================================
  {
    id: 5,
    versionTag: '۵.۰',
    title: {
      fa: 'عصر پنجم: جمشید، ضحاک ماردوش و قیام کاوه آهنگر',
      fa_old: 'روزگار پنجم: بیداد ضحاک ماردوش و خروش کاوه آهنگر',
      en: 'Epoch V: Zahhak the Serpent-King & Kaveh’s Uprising',
    },
    subtitle: {
      fa: 'پیش‌بند چرمی، پتک آهنگری و درفش کاویانی در برابر ضحاک ماردوش',
      fa_old: 'درفش کاویانی و پتک کاوه در برابر اژیدهاک ماردوش',
      en: 'The Blacksmith’s Apron & Derafsh Kaviani Against Serpent-Shouldered Zahhak',
    },
    loreIntro: {
      fa: 'چون جمشید از فره ایزدی دور شد، ضحاک ماردوش هزار سال بر ایرانشهر فرمان راند و مغز جوانان را خوراک دو مار سیاه شانه‌هایش ساخت؛ تا کاوه آهنگر چرم آهنگری را بر نیزه زد و درفش کاویانی را برافراشت.',
      fa_old: 'هزار سال بیداد ضحاک ماردوش ایرانشهر را به خون کشید، تا کاوه دادخواه پیش‌بند چرمین بر سر نیزه کرد و درفش کاویانی را پیشاپیش مردمان برافراشت.',
      en: 'For a thousand years the tyrant Zahhak fed the two black serpents on his shoulders with the brains of Persian youth—until Kaveh the Blacksmith raised his leather apron as the Derafsh Kaviani.',
    },
    environmentTheme: {
      id: 'babylon_palace',
      skyColor: 0x1c0707,
      fogColor: 0x290b0b,
      floorTint: 0x2b1818,
      torchColor: 0xdc2626,
    },
    goodHero: {
      id: 'kaveh',
      name: { fa: 'کاوه آهنگر', fa_old: 'کاوه دادخواه آهنگر', en: 'Kaveh the Blacksmith' },
      title: { fa: 'برافرازنده درفش کاویانی با پتک پولادین', fa_old: 'دارنده درفش کاویانی و پتک گران', en: 'Bearer of the Derafsh Kaviani & Forge Hammer' },
      primaryColor: 0xb91c1c,
      secondaryColor: 0x78350f,
      accentColor: 0xfbbf24,
      skinColor: 0xc69c72,
      armorStyle: 'blacksmith_apron',
      weaponStyle: 'smith_hammer',
      specialTrait: 'derafsh_kaviani',
      scale: 1.06,
    },
    evilBoss: {
      id: 'zahhak',
      name: { fa: 'ضحاک ماردوش (اژیدهاک)', fa_old: 'ضحاک ماردوش تازی', en: 'Zahhak the Serpent-Shouldered' },
      title: { fa: 'شهریار خون‌خوار با دو مار سیاه بر شانه', fa_old: 'بیدادگر هزارساله با ماران دوش', en: 'Tyrant of a Thousand Years & Twin Black Serpents' },
      primaryColor: 0x450a0a,
      secondaryColor: 0x09090b,
      accentColor: 0xef4444,
      skinColor: 0xa1a1aa,
      armorStyle: 'serpent_shoulders',
      weaponStyle: 'twin_fangs',
      specialTrait: 'shoulder_serpents',
      scale: 1.36,
    },
    evilCommander: {
      id: 'zahhak',
      name: { fa: 'ضحاک ماردوش', fa_old: 'اژیدهاک ماردوش', en: 'Zahhak the Serpent-King' },
      title: { fa: 'فرمانروای تخت خونین و ماران سیاه', fa_old: 'خداوندگار ماران سیاه', en: 'Sovereign of the Twin Shoulder Serpents' },
      primaryColor: 0x450a0a,
      secondaryColor: 0x09090b,
      accentColor: 0xef4444,
      skinColor: 0xa1a1aa,
      armorStyle: 'serpent_shoulders',
      weaponStyle: 'twin_fangs',
      specialTrait: 'shoulder_serpents',
      scale: 1.15,
    },
    goodBoss: {
      id: 'kaveh',
      name: { fa: 'کاوه آهنگر و درفش کاویانی', fa_old: 'کاوه آهنگر و درفش فرهمند', en: 'Kaveh the Blacksmith of the Uprising' },
      title: { fa: 'پیشوای خیزش ایرانشهر علیه بیداد', fa_old: 'سالار دادخواهان ایرانشهر', en: 'Champion of the Iron Forge & Derafsh Kaviani' },
      primaryColor: 0xdc2626,
      secondaryColor: 0x92400e,
      accentColor: 0xfde047,
      skinColor: 0xc69c72,
      armorStyle: 'blacksmith_apron',
      weaponStyle: 'smith_hammer',
      specialTrait: 'derafsh_kaviani',
      scale: 1.3,
    },
    vanguardNameGood: {
      fa: 'دادخواهان و آهنگران کاویانی',
      fa_old: 'قیام‌کنندگان درفش کاویانی',
      en: 'Rebels of the Kaviani Banner',
    },
    vanguardNameEvil: {
      fa: 'گزماوان و دژخیمان ماردوش',
      fa_old: 'عسسان و ماربانان ضحاک',
      en: 'Serpent Guards of Zahhak',
    },
    crossroads: {
      prompt: {
        fa: 'طومار گواهی ضحاک در تالار کاخ پیش روی توست. آیا طومار دروغین بیدادگر را پاره می‌کنی و زندانیان را آزاد می‌سازی، یا کاخ را در آتش خشم و انتقام بر سر همه فرو می‌ریزی؟',
        fa_old: 'محضر دروغین ضحاک پیش روی توست. آیا آن را به زیر پا می‌افکنی و اسیران را رها می‌سازی یا تالار را به خون جملگی رنگین می‌کنی؟',
        en: 'Zahhak’s scroll of false testimony lies before the throne. Do you tear the scroll and liberate the condemned youth, or slaughter the entire palace court in blind vengeance?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: دریدن طومار ضحاک و رهایی جوانان اسیر', fa_old: 'آیین اشه: دریدن محضر بیداد و رهایی اسیران', en: 'Path of Asha: Tear the Tyrant’s Scroll & Free the Youth' },
        consequence: { fa: 'درفش کاویانی درخشید و پایداری ایرانشهر اوج گرفت', fa_old: 'درفش کاویانی فروزان گشت و ایرانشهر نیرو گرفت', en: 'The Derafsh Kaviani blazed with light, boosting realm stability' },
        stabilityDelta: 18,
        farrDelta: 28,
        attackMultiplierBonus: 0.2,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: حمام خون در ایوان ضحاک', fa_old: 'آیین اهریمن: کشتار بی‌امان در ایوان شاهی', en: 'Path of Ahriman: Drench the Palace in Blood' },
        consequence: { fa: 'پتک پولادین سنگین‌تر و کشنده‌تر شد اما ترس بر شهر سایه افکند', fa_old: 'پتک آهنین خون‌بارتر گشت و هراس بر شهر افتاد', en: 'Crushing weapon power gained, but terror gripped the populace' },
        stabilityDelta: -16,
        farrDelta: -28,
        attackMultiplierBonus: 0.36,
      },
    },
  },

  // ============================================================================
  // EPOCH 6: FEREYDUN, BULL-HEADED MACE & BINDING AZHIDAHAK IN DAMAVAND
  // ============================================================================
  {
    id: 6,
    versionTag: '۶.۰',
    title: {
      fa: 'عصر ششم: فریدون فرخ، گرز گاوسار و به بند کشیدن اژیدهاک در دماوند',
      fa_old: 'روزگار ششم: فریدون فرخ و دربند کردن ضحاک در دماوندکوه',
      en: 'Epoch VI: Fereydun, The Bull-Headed Mace & Mount Damavand',
    },
    subtitle: {
      fa: 'زره زمردین و طلایی با گرز گاوسار در برابر اژیدهاک در آتشفشان دماوند',
      fa_old: 'جوشن زمردین و گرز گاوسار در غار آتشین دماوند',
      en: 'Emerald-Gold Armor & Bull-Headed Mace in the Crater of Damavand',
    },
    loreIntro: {
      fa: 'فریدون فرخ به کین‌پروری فرانک و شیر گاو برمایه بالید، گرز گاوسار زرین را دست گرفت و اژیدهاک ماردوش را تا دهانه آتشفشان دماوند دنبال کرد تا او را به میخ‌های گران در کوه ببندد.',
      fa_old: 'فریدون فرخ با گرز گاوسار زرین و شاخ‌دار، بر کاخ ضحاک تاخت و به فرمان سروش، اژیدهاک را در غار دماوندکوه به بند پولادین کشید.',
      en: 'Nurtured by the sacred cow Barmayeh, Fereydun forged the golden Bull-Headed Mace (Gorz-e Gavsar) to shatter Zahhak’s crown and chain him inside volcanic Mount Damavand.',
    },
    environmentTheme: {
      id: 'damavand_crater',
      skyColor: 0x170a05,
      fogColor: 0x261209,
      floorTint: 0x29201c,
      torchColor: 0xf59e0b,
      hasDamavandLava: true,
    },
    goodHero: {
      id: 'fereydun',
      name: { fa: 'فریدون فرخ', fa_old: 'فریدون آبتین', en: 'Fereydun the Glorious' },
      title: { fa: 'دارنده گرز گاوسار و زره زمردین', fa_old: 'شهریار گرز گاوسار زرین', en: 'Wielder of the Golden Bull-Headed Mace' },
      primaryColor: 0x059669,
      secondaryColor: 0xd97706,
      accentColor: 0xfef08a,
      skinColor: 0xd6b496,
      armorStyle: 'emerald_royal',
      weaponStyle: 'bull_mace',
      specialTrait: 'white_beard_crown',
      scale: 1.07,
    },
    evilBoss: {
      id: 'azhidahak_dragon',
      name: { fa: 'اژیدهاک خشمگین دماوند', fa_old: 'اژیدهاک گسسته‌بند دماوند', en: 'Azhidahak Unchained of Damavand' },
      title: { fa: 'هیولای ماردوش در دل آتشفشان دماوند', fa_old: 'اژدهای سه‌سر در کوره دماوندکوه', en: 'The Serpent-Fiend of the Volcanic Abyss' },
      primaryColor: 0x7f1d1d,
      secondaryColor: 0x18181b,
      accentColor: 0xf97316,
      skinColor: 0x3f3f46,
      armorStyle: 'serpent_shoulders',
      weaponStyle: 'twin_fangs',
      specialTrait: 'shoulder_serpents',
      scale: 1.44,
    },
    evilCommander: {
      id: 'azhidahak_dragon',
      name: { fa: 'اژیدهاک دماوند', fa_old: 'اژیدهاک ماردوش', en: 'Azhidahak of Damavand' },
      title: { fa: 'گسلنده زنجیرهای پولادین دماوند', fa_old: 'شکننده میخ‌های دماوندکوه', en: 'Breaker of Damavand’s Iron Chains' },
      primaryColor: 0x7f1d1d,
      secondaryColor: 0x18181b,
      accentColor: 0xf97316,
      skinColor: 0x3f3f46,
      armorStyle: 'serpent_shoulders',
      weaponStyle: 'twin_fangs',
      specialTrait: 'shoulder_serpents',
      scale: 1.18,
    },
    goodBoss: {
      id: 'fereydun',
      name: { fa: 'فریدون فرخ با گرز گاوسار', fa_old: 'فریدون فرهمند با گرز گاوسار', en: 'King Fereydun with the Bull-Headed Mace' },
      title: { fa: 'زنجیرکننده اژیدهاک در دماوندکوه', fa_old: 'پاسدار پیمان سروش در دماوند', en: 'Binder of the Serpent King' },
      primaryColor: 0x10b981,
      secondaryColor: 0xd97706,
      accentColor: 0xfef08a,
      skinColor: 0xd6b496,
      armorStyle: 'emerald_royal',
      weaponStyle: 'bull_mace',
      specialTrait: 'golden_wings',
      scale: 1.32,
    },
    vanguardNameGood: {
      fa: 'سواران گرزدار فریدون',
      fa_old: 'گرزداران فریدون فرخ',
      en: 'Mace-Bearers of Fereydun',
    },
    vanguardNameEvil: {
      fa: 'عفریت‌ها و مارهای آتشفشان دماوند',
      fa_old: 'دیوان آتشخوار دماوند',
      en: 'Volcanic Viper-Fiends of Damavand',
    },
    crossroads: {
      prompt: {
        fa: 'گرز گاوسار بر کلاهخود اژیدهاک فرود آمده است. سروش ایزدی می‌گوید: «مزن، که زمان مرگ او فرا نرسیده و باید در دماوند به بند کشیده شود تا جهان از آشوب بیشتر نلرزد.» چه می‌کنی؟',
        fa_old: 'سروش ایزدی فرود می‌آید که: «مزن! او را به زنجیر گران در غار دماوند ببند.» آیا فرمان سروش را می‌پذیری یا مغز اژیدهاک را با گرز گاوسار می‌شکافی؟',
        en: 'Sorush descends as your Bull-Headed Mace hangs over Zahhak: "Do not slay him yet, lest greater chaos spill across the earth; chain him within Mount Damavand." Your choice?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: به زنجیر کشیدن اژیدهاک در غار دماوند', fa_old: 'آیین اشه: بستن اژیدهاک به فرمان سروش', en: 'Path of Asha: Bind Azhidahak in Eternal Chains' },
        consequence: { fa: 'نظم کیهانی و پایداری ایرانشهر تثبیت شد', fa_old: 'داد و آرامش در ایرانشهر استوار گشت', en: 'Cosmic order and Iranshahr stability preserved' },
        stabilityDelta: 20,
        farrDelta: 25,
        attackMultiplierBonus: 0.18,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: شکافتن جمجمه اژیدهاک و رها شدن نفرین خون', fa_old: 'آیین اهریمن: کوفتن سر ضحاک و آشوب خون', en: 'Path of Ahriman: Shatter His Skull & Unleash the Blood Curse' },
        consequence: { fa: 'نفرین ماران سیاه قدرت حملاتت را دوچندان کرد اما ایرانشهر دچار آشوب شد', fa_old: 'زور گرز فزونی گرفت لیکن آشوب در گیتی افتاد', en: 'Venomous power surged into your mace as chaos shook the realm' },
        stabilityDelta: -18,
        farrDelta: -26,
        attackMultiplierBonus: 0.36,
      },
    },
  },

  // ============================================================================
  // EPOCH 7: ZAL, SIMORGH & THE SEVEN LABORS OF ROSTAM (DIV-E SEPID)
  // ============================================================================
  {
    id: 7,
    versionTag: '۷.۰',
    title: {
      fa: 'عصر هفتم: زال، سیمرغ و هفت‌خوان رستم',
      fa_old: 'روزگار هفتم: هفت‌خوان رستم و رزم دیو سپید مازندران',
      en: 'Epoch VII: The Seven Labors of Rostam & Div-e Sepid',
    },
    subtitle: {
      fa: 'زره ببر بیان و پر سرخ سیمرغ در برابر دیو سفید مازندران با سنگ آسیاب',
      fa_old: 'تهمتن با ببر بیان و پر سیمرغ در برابر دیو سپید مازندران',
      en: 'Rostam in Babr-e Bayan Armor Against the Millstone-Wielding White Div',
    },
    loreIntro: {
      fa: 'رستم دستان، فرزند زال زر و پرورده سایه سیمرغ، با زره راه‌راه ببر بیان، ریش دوشاخه و پر سرخ سیمرغ بر کلاهخود، شش خوان را پشت سر گذاشت و در خوان هفتم وارد غار تاریک دیو سفید مازندران شد.',
      fa_old: 'رستم تهمتن با جوشن ببر بیان و پر فروزان سیمرغ، پس از گذر از شش خوان هولناک، در غار مازندران با دیو سپید کوه‌پیکر و سنگ آسیاب او روبه‌رو گشت.',
      en: 'Clad in his striped Babr-e Bayan tiger-coat, forked beard, and crimson Simorgh plume, Rostam enters the cavern of Mazandaran to face the colossal Div-e Sepid and his millstone.',
    },
    environmentTheme: {
      id: 'mazandaran_cavern',
      skyColor: 0x090d16,
      fogColor: 0x111827,
      floorTint: 0x1f2937,
      torchColor: 0xf43f5e,
    },
    goodHero: {
      id: 'rostam_babr',
      name: { fa: 'رستم دستان (تهمتن)', fa_old: 'رستم زال دستان', en: 'Rostam Dastan (Tahmtan)' },
      title: { fa: 'جهان‌پهلوان با زره ببر بیان و پر سیمرغ', fa_old: 'یل سیستان با ببر بیان و پر سیمرغ', en: 'Champion of Zabulistan in Babr-e Bayan Armor' },
      primaryColor: 0xd97706,
      secondaryColor: 0x1c1917,
      accentColor: 0xe11d48,
      skinColor: 0xc69c72,
      armorStyle: 'babr_bayan',
      weaponStyle: 'bull_mace',
      specialTrait: 'simorgh_feather',
      scale: 1.12,
    },
    evilBoss: {
      id: 'div_sepid',
      name: { fa: 'دیو سفید مازندران', fa_old: 'دیو سپید مازندران', en: 'Div-e Sepid of Mazandaran' },
      title: { fa: 'غول سپیدموی غار تاریک مسلح به سنگ آسیاب', fa_old: 'پهلوان دیوان مازندران با سنگ آسیاب', en: 'Colossal White Demon Armed with a Millstone' },
      primaryColor: 0xf4f4f5,
      secondaryColor: 0x3f3f46,
      accentColor: 0xdc2626,
      skinColor: 0xe4e4e7,
      armorStyle: 'chalk_giant',
      weaponStyle: 'millstone',
      specialTrait: 'horned_skull',
      scale: 1.5,
    },
    evilCommander: {
      id: 'div_sepid',
      name: { fa: 'دیو سفید مازندران', fa_old: 'دیو سپید کوه‌پیکر', en: 'Div-e Sepid of Mazandaran' },
      title: { fa: 'فرمانروای دیوان مازندران با سنگ آسیاب', fa_old: 'سالار غار تاریک مازندران', en: 'Lord of the White Mane & Crushing Millstone' },
      primaryColor: 0xf4f4f5,
      secondaryColor: 0x3f3f46,
      accentColor: 0xdc2626,
      skinColor: 0xe4e4e7,
      armorStyle: 'chalk_giant',
      weaponStyle: 'millstone',
      specialTrait: 'horned_skull',
      scale: 1.24,
    },
    goodBoss: {
      id: 'rostam_babr',
      name: { fa: 'رستم دستان (فاتح هفت‌خوان)', fa_old: 'رستم تهمتن (شیر سیستان)', en: 'Rostam Dastan of the Seven Labors' },
      title: { fa: 'پهلوان زره ببر بیان و گرز گاوسار', fa_old: 'پشت و پناه ایرانشهر با پر سیمرغ', en: 'Shield of Iranshahr & Bearer of Simorgh’s Plume' },
      primaryColor: 0xd97706,
      secondaryColor: 0x1c1917,
      accentColor: 0xe11d48,
      skinColor: 0xc69c72,
      armorStyle: 'babr_bayan',
      weaponStyle: 'bull_mace',
      specialTrait: 'simorgh_feather',
      scale: 1.35,
    },
    vanguardNameGood: {
      fa: 'یلان زابلستان و سواران رستم',
      fa_old: 'گردن‌کشان زابل و سیستان',
      en: 'Zabulistan Vanguard of Rostam',
    },
    vanguardNameEvil: {
      fa: 'دیوان جادوگر مازندران',
      fa_old: 'دیوان خون‌خوار مازندران',
      en: 'Sorcerer-Demons of Mazandaran',
    },
    crossroads: {
      prompt: {
        fa: 'چشمان کاووس شاه و لشکریان ایران در مازندران نابینا شده است. آیا خون جگر دیو سفید را تنها برای بینا کردن چشم ایرانیان به کار می‌بری یا مازندران را به خاک و خون می‌کشی؟',
        fa_old: 'دیدگان کاووس و لشکر ایران از افسون دیوان تیره گشته است. آیا خون جگر دیو سپید را به درمان ایرانیان می‌بری یا مازندران را یکسره در آتش قهر می‌سوزانی؟',
        en: 'King Kavus and his army lie blinded by Mazandaran sorcery. Will you use the White Div’s heart-blood strictly to restore their sight, or raze all of Mazandaran to ash?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: درمان چشمان لشکر ایران و پیمان داد در مازندران', fa_old: 'آیین اشه: گشودن چشم ایرانیان و بخشایش', en: 'Path of Asha: Heal the Blinded Host & Establish Justice' },
        consequence: { fa: 'فره ایزدی و پایداری ایرانشهر فزونی یافت', fa_old: 'فره ایزدی بر درفش تهمتن تابید', en: 'Sight restored to the army; Iranshahr stability rose' },
        stabilityDelta: 16,
        farrDelta: 26,
        attackMultiplierBonus: 0.2,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: نوشیدن خون دیو و ویرانی کامل مازندران', fa_old: 'آیین اهریمن: تاراج و خون‌ریزی در مازندران', en: 'Path of Ahriman: Consume Demon Blood & Raze Mazandaran' },
        consequence: { fa: 'زور بازوی دیوانه به رستم رسید اما فره ایزدی کاهش یافت', fa_old: 'نیروی اهریمنی در بازو نشست و فره کاست', en: 'Monstrous physical strength gained at the cost of sacred grace' },
        stabilityDelta: -15,
        farrDelta: -26,
        attackMultiplierBonus: 0.36,
      },
    },
  },

  // ============================================================================
  // EPOCH 8: THE TRAGEDY OF ROSTAM AND SOHRAB
  // ============================================================================
  {
    id: 8,
    versionTag: '۸.۰',
    title: {
      fa: 'عصر هشتم: تراژدی رستم و سهراب',
      fa_old: 'روزگار هشتم: رزم و سوگ رستم و سهراب یل',
      en: 'Epoch VIII: The Tragedy of Rostam and Sohrab',
    },
    subtitle: {
      fa: 'سهراب جوان با زره فیروزه‌ای و بازوبند تهمینه در برابر تقدیر بی‌رحم',
      fa_old: 'سهراب نوجوان با جوشن فیروزه‌ای و مهره بازوبند در برابر تهمتن',
      en: 'Young Sohrab with the Glowing Armlet Against Unforgiving Fate',
    },
    loreIntro: {
      fa: 'سهراب جوان، بی‌ریش و آراسته به زره فیروزه‌ای و مهره بازوبند درخشان تهمینه بر بازو، به جست‌وجوی پدر به ایران آمد؛ اما نیرنگ افراسیاب و هومان، پدر و پسر را نشناخته روبه‌روی هم قرار داد.',
      fa_old: 'سهراب یل با جوشن فیروزه‌ای و مهره تابناک بازوبند که تهمینه بر بازویش بسته بود، در دشت نبرد بی‌آنکه پدر را بشناسد در برابر رستم دستان صف آراست.',
      en: 'Youthful and beardless, wearing turquoise scale mail and Tahmineh’s glowing armlet on his arm, Sohrab seeks his father—only to be manipulated into a fatal duel with Rostam.',
    },
    environmentTheme: {
      id: 'border_plains_dusk',
      skyColor: 0x1f0d14,
      fogColor: 0x2e131d,
      floorTint: 0x362426,
      torchColor: 0xfbbf24,
    },
    goodHero: {
      id: 'sohrab',
      name: { fa: 'سهراب یل', fa_old: 'سهراب پور رستم', en: 'Young Sohrab' },
      title: { fa: 'یل جوان با زره فیروزه‌ای و بازوبند درخشان تهمینه', fa_old: 'نوجوان فیروزه‌پوش با مهره بازوبند', en: 'Turquoise-Armored Youth Bearing Tahmineh’s Armlet' },
      primaryColor: 0x06b6d4,
      secondaryColor: 0x0e7490,
      accentColor: 0xfde047,
      skinColor: 0xe5c2a3,
      armorStyle: 'turquoise_youth',
      weaponStyle: 'persian_shamshir',
      specialTrait: 'tahmineh_armlet',
      scale: 1.04,
    },
    evilBoss: {
      id: 'rostam_babr',
      name: { fa: 'رستم دستان (در غبار نشناختن)', fa_old: 'رستم تهمتن (هماورد ناشناس)', en: 'Rostam Dastan (Unrecognized Father)' },
      title: { fa: 'پهلوان پیر در چنگال تقدیر و فریب هومان', fa_old: 'شیر پیر سیستان در دام تقدیر', en: 'The Unyielding Lion Bound by Tragic Fate' },
      primaryColor: 0xb45309,
      secondaryColor: 0x1c1917,
      accentColor: 0xdc2626,
      skinColor: 0xc69c72,
      armorStyle: 'babr_bayan',
      weaponStyle: 'bull_mace',
      specialTrait: 'simorgh_feather',
      scale: 1.36,
    },
    evilCommander: {
      id: 'turan_warlord',
      name: { fa: 'هومان و بارمان تورانی', fa_old: 'هومان ویسه تورانی', en: 'Homan the Turanian Instigator' },
      title: { fa: 'فرمانده سپاه توران و پنهان‌کننده نام رستم', fa_old: 'سالار نیرنگ‌باز افراسیاب', en: 'Architect of the Fratricidal Deception' },
      primaryColor: 0x7f1d1d,
      secondaryColor: 0x18181b,
      accentColor: 0xef4444,
      skinColor: 0xa1a1aa,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.15,
    },
    goodBoss: {
      id: 'sohrab',
      name: { fa: 'سهراب یل (شیرزاد سمنگان)', fa_old: 'سهراب فرهمند', en: 'Sohrab the Lion of Samangan' },
      title: { fa: 'دارنده مهره بازوبند و شمشیر فیروزگون', fa_old: 'پهلوان جوان با بازوبند تهمینه', en: 'Bearer of the Royal Armlet' },
      primaryColor: 0x06b6d4,
      secondaryColor: 0x0e7490,
      accentColor: 0xfde047,
      skinColor: 0xe5c2a3,
      armorStyle: 'turquoise_youth',
      weaponStyle: 'persian_shamshir',
      specialTrait: 'tahmineh_armlet',
      scale: 1.28,
    },
    vanguardNameGood: {
      fa: 'جنگجویان وفادار دژ سپید',
      fa_old: 'گردان دژ سپید و سمنگان',
      en: 'Loyal Vanguard of Samangan',
    },
    vanguardNameEvil: {
      fa: 'سپاهیان فتنه‌گر هومان تورانی',
      fa_old: 'لشکریان نیرنگ‌باز توران',
      en: 'Turanian Deceivers of Homan',
    },
    crossroads: {
      prompt: {
        fa: 'دل سهراب گواهی می‌دهد که پهلوان روبه‌رویش همان رستم است، اما هومان بانگ می‌زند که او را بی‌درنگ بکشد. آیا ندای مهر و حقیقت را پی می‌گیری یا خنجر خشم را تا دسته فرو می‌بری؟',
        fa_old: 'دل سهراب گواهی می‌دهد که این شیرمرد همانا پدر اوست. آیا نشان بازوبند را آشکار می‌سازی یا به فریب هومان دست به دشنه می‌بری؟',
        en: 'Sohrab’s heart whispers that the warrior before him is his father Rostam, while Homan urges an immediate killing blow. Will you reveal the armlet of truth or strike without mercy?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: آشکار کردن مهره بازوبند تهمینه و جستن حقیقت', fa_old: 'آیین اشه: نمودن بازوبند و پاسداشت مهر پدر', en: 'Path of Asha: Reveal Tahmineh’s Armlet & Seek Truth' },
        consequence: { fa: 'نور بازوبند درخشید و فره ایزدی ایرانشهر را از سوگ بزرگ حفظ کرد', fa_old: 'فروغ مهر تابید و ایرانشهر از گزند ایمن گشت', en: 'The armlet’s light pierced the deceit, strengthening Iranshahr' },
        stabilityDelta: 18,
        farrDelta: 28,
        attackMultiplierBonus: 0.18,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: فرو بردن دشنه در سینه حریف بی‌امان', fa_old: 'آیین اهریمن: دریدن پهلوی حریف در غبار کین', en: 'Path of Ahriman: Drive the Dagger Deep Without Remorse' },
        consequence: { fa: 'نوشدارو دیر رسید؛ قدرت ضربات خونین شد اما ایرانشهر در ماتم فرو رفت', fa_old: 'سوگ سهراب گیتی را تیره کرد و تیغ خون‌بارتر گشت', en: 'Noshdaru came too late; lethal power rose as grief darkened the realm' },
        stabilityDelta: -18,
        farrDelta: -28,
        attackMultiplierBonus: 0.36,
      },
    },
  },

  // ============================================================================
  // EPOCH 9: SIAVASH'S ORDEAL OF FIRE & VENGEANCE ON AFRASIAB
  // ============================================================================
  {
    id: 9,
    versionTag: '۹.۰',
    title: {
      fa: 'عصر نهم: گذر سیاوش از آتش و کین‌خواهی کیخسرو از افراسیاب',
      fa_old: 'روزگار نهم: گذر سیاوش از کوه آتش و کین‌خواهی از افراسیاب',
      en: 'Epoch IX: Siavash’s Ordeal of Fire & Vengeance on Afrasiab',
    },
    subtitle: {
      fa: 'شاهزاده سیاوش با جامه سپید و نقره‌ای در میان حلقه شعله‌های آتش مقدس',
      fa_old: 'سیاوش پاک‌دامن با جامه سپید در میان کوه آتش',
      en: 'Prince Siavash in White & Silver Amidst the Ring of Sacred Flame',
    },
    loreIntro: {
      fa: 'شاهزاده سیاوش برای اثبات پاکی خویش با جامه سپید و کلاهخود نقره‌ای بر اسب شبرنگ بهزاد به دل کوه آتش زد و بی‌گزند بیرون آمد؛ و آنگاه خون او، کین‌خواهی بزرگ کیخسرو از افراسیاب را برانگیخت.',
      fa_old: 'سیاوش پاک‌نهاد با رخت سپید و سیمین در میان دو کوه آتشِ زبانهکش گذر کرد و فره ایزدی پاکی او را بر جهانیان آشکار ساخت.',
      en: 'Clad in immaculate white and silver vestments encircled by a halo of sacred fire, Prince Siavash rides through the mountain of flames and confronts the tyranny of Afrasiab.',
    },
    environmentTheme: {
      id: 'sacred_fire_ordeal',
      skyColor: 0x1c0b05,
      fogColor: 0x2d1208,
      floorTint: 0x2b1e19,
      torchColor: 0xfbbf24,
      hasRingOfFire: true,
    },
    goodHero: {
      id: 'siavash',
      name: { fa: 'شاهزاده سیاوش', fa_old: 'سیاوش پاک‌نهاد', en: 'Prince Siavash' },
      title: { fa: 'شهریار جامه‌سپید در حلقه آتش مقدس', fa_old: 'گذرنده از کوه آتش با جامه سپید و سیمین', en: 'White-Robed Prince of the Sacred Fire Ordeal' },
      primaryColor: 0xf8fafc,
      secondaryColor: 0x94a3b8,
      accentColor: 0xf59e0b,
      skinColor: 0xe5c2a3,
      armorStyle: 'sacred_white',
      weaponStyle: 'persian_shamshir',
      specialTrait: 'sacred_fire_halo',
      scale: 1.05,
    },
    evilBoss: {
      id: 'afrasiab',
      name: { fa: 'افراسیاب تورانی و گرسیوز', fa_old: 'افراسیاب پشنگ و گرسیوز', en: 'King Afrasiab of Turan' },
      title: { fa: 'پادشاه خون‌ریز توران و دشمن جاودان ایرانشهر', fa_old: 'خون‌ریز سیاوش‌گرد و سالار توران', en: 'Bloodstained Monarch of Turan' },
      primaryColor: 0x450a0a,
      secondaryColor: 0x18181b,
      accentColor: 0xdc2626,
      skinColor: 0xa1a1aa,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.38,
    },
    evilCommander: {
      id: 'afrasiab',
      name: { fa: 'افراسیاب تورانی', fa_old: 'افراسیاب سالار توران', en: 'Afrasiab of Turan' },
      title: { fa: 'فرمانروای سیاه‌پوش توران', fa_old: 'دشمن سوگندخورده کیانیان', en: 'Sworn Nemesis of the Kayanian Throne' },
      primaryColor: 0x450a0a,
      secondaryColor: 0x18181b,
      accentColor: 0xdc2626,
      skinColor: 0xa1a1aa,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.16,
    },
    goodBoss: {
      id: 'siavash',
      name: { fa: 'شاهزاده سیاوش و کیخسرو', fa_old: 'سیاوش و کیخسرو کین‌خواه', en: 'Prince Siavash & Kay Khosrow' },
      title: { fa: 'پاسداران پیمان و آتش پاک ایزدی', fa_old: 'فروزندگان آذر گشنسپ', en: 'Guardians of the Sacred Flame & Royal Oath' },
      primaryColor: 0xf8fafc,
      secondaryColor: 0xcbd5e1,
      accentColor: 0xfbbf24,
      skinColor: 0xe5c2a3,
      armorStyle: 'sacred_white',
      weaponStyle: 'persian_shamshir',
      specialTrait: 'sacred_fire_halo',
      scale: 1.3,
    },
    vanguardNameGood: {
      fa: 'سواران سپیدپوش سیاوش‌گرد',
      fa_old: 'پاسداران سیاوش‌گرد',
      en: 'White-Clad Knights of Siavashgird',
    },
    vanguardNameEvil: {
      fa: 'شمشیرزنان گرسیوز و افراسیاب',
      fa_old: 'دژخیمان گرسیوز تورانی',
      en: 'Executioners of Garsivaz & Afrasiab',
    },
    crossroads: {
      prompt: {
        fa: 'در میان شعله‌های آتش و میدان کین‌خواهی، گروگان‌های تورانی در بندند. سیاوش سوگند خورده بود که هرگز پیمان نشکند و خون بی‌گناه نریزد. آیا پیمان سیاوش را پاس می‌داری یا به آیین کین، همه را گردن می‌زنی؟',
        fa_old: 'پیمان سیاوش بر وفاداری و پرهیز از خون‌ریزی نارواست. آیا سوگند پاک او را نگاه می‌داری یا طشت زرین را از خون اسیران پر می‌سازی؟',
        en: 'Encircled by the ring of fire, Turanian hostages plead for mercy. Siavash swore never to break an oath. Do you honor his immaculate covenant or spill their blood into the golden basin?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: وفای به عهد سیاوش و داوری عادلانه', fa_old: 'آیین اشه: پاسداشت پیمان پاک سیاوش', en: 'Path of Asha: Honor Siavash’s Immaculate Oath' },
        consequence: { fa: 'حلقه آتش مقدس فروزان‌تر شد و فره کیانی اوج گرفت', fa_old: 'فره کیانی و پایندگی ایرانشهر فزونی یافت', en: 'The halo of sacred fire blazed brighter; stability increased' },
        stabilityDelta: 18,
        farrDelta: 28,
        attackMultiplierBonus: 0.2,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: ریختن خون در طشت زرین و شکستن پیمان', fa_old: 'آیین اهریمن: خون‌ریزی در طشت زرین و پیمان‌شکنی', en: 'Path of Ahriman: Fill the Golden Basin with Blood' },
        consequence: { fa: 'گیاه سیاوشان از خون رویید؛ حملات مرگبار شد اما فره کیانی آسیب دید', fa_old: 'شمشیر خون‌آشام گشت و فره ایزدی تیره شد', en: 'Crimson fury empowered your blade while darkening the royal Farr' },
        stabilityDelta: -18,
        farrDelta: -28,
        attackMultiplierBonus: 0.36,
      },
    },
  },

  // ============================================================================
  // EPOCH 10: ROSTAM VS. ESFANDIYAR THE BRAZEN-BODIED
  // ============================================================================
  {
    id: 10,
    versionTag: '۱۰.۰',
    title: {
      fa: 'عصر دهم: نبرد رستم و اسفندیار روئین‌تن',
      fa_old: 'روزگار دهم: رزم رستم دستان و اسفندیار رویین‌تن',
      en: 'Epoch X: Rostam vs. Esfandiyar the Brazen-Bodied',
    },
    subtitle: {
      fa: 'کمان چاچی و تیر گز دوشاخه سیمرغ در برابر زره و نقاب سرتاسر زرین اسفندیار',
      fa_old: 'تیر گز دوشاخه سیمرغ در برابر جوشن و نقاب زرین رویین‌تن',
      en: 'The Two-Pronged Tamarisk Arrow Against Esfandiyar’s Full Golden Armor',
    },
    loreIntro: {
      fa: 'اسفندیار روئین‌تن با زره و نقاب سرتاسر زرین و رویین که هیچ تیغی بر تنش کارگر نبود، به فرمان گشتاسپ خواهان به بند کشیدن رستم شد؛ و سیمرغ راز تیر گز دوشاخه را به رستم آموخت، هرچند فرمود که کشنده اسفندیار در هر دو جهان بی‌نصیب خواهد ماند.',
      fa_old: 'اسفندیار رویین‌تن با نقاب و جوشن سرتاسر زرین به زابل آمد تا دست تهمتن را به بند کشد؛ و سیمرغ شاخه گز را دوپیکانه ساخت و راز دیدگان اسفندیار را بر رستم گشود.',
      en: 'Impervious to every blade in his head-to-toe golden armor and war mask, Prince Esfandiyar demands Rostam in chains—forcing Rostam to nock the two-pronged Tamarisk Arrow blessed by Simorgh.',
    },
    environmentTheme: {
      id: 'hirmand_riverbank',
      skyColor: 0x1a1207,
      fogColor: 0x291d0c,
      floorTint: 0x33281b,
      torchColor: 0xfbbf24,
    },
    goodHero: {
      id: 'rostam_chachi',
      name: { fa: 'رستم با کمان چاچی و تیر گز', fa_old: 'رستم دستان با تیر گز سیمرغ', en: 'Rostam with Chachi Bow & Tamarisk Arrow' },
      title: { fa: 'تیرانداز تیر گز دوشاخه به راهنمایی سیمرغ', fa_old: 'دارنده کمان چاچی و پر سیمرغ', en: 'Wielder of the Chachi Bow & Two-Pronged Tamarisk Shaft' },
      primaryColor: 0xd97706,
      secondaryColor: 0x1c1917,
      accentColor: 0xe11d48,
      skinColor: 0xc69c72,
      armorStyle: 'babr_bayan',
      weaponStyle: 'chachi_bow_tamarisk',
      specialTrait: 'simorgh_feather',
      scale: 1.12,
    },
    evilBoss: {
      id: 'esfandiyar',
      name: { fa: 'اسفندیار روئین‌تن', fa_old: 'اسفندیار رویین‌تن کیانی', en: 'Esfandiyar the Brazen-Bodied' },
      title: { fa: 'شاهزاده شکست‌ناپذیر با زره و نقاب سرتاسر زرین', fa_old: 'یل رویین‌تن با نقاب و جوشن زرین', en: 'Immortal Prince in Full Golden Armor & War Mask' },
      primaryColor: 0xfbbf24,
      secondaryColor: 0xb45309,
      accentColor: 0xfef08a,
      skinColor: 0xfde047,
      armorStyle: 'golden_brazen',
      weaponStyle: 'golden_twin_blades',
      specialTrait: 'golden_visored_mask',
      scale: 1.35,
    },
    evilCommander: {
      id: 'esfandiyar',
      name: { fa: 'اسفندیار روئین‌تن (به فرمان گشتاسپ)', fa_old: 'اسفندیار رویین‌تن', en: 'Esfandiyar the Brazen-Bodied' },
      title: { fa: 'مامور به بند کشیدن جهان‌پهلوان زابل', fa_old: 'سالار زرین‌نقاب گشتاسپ', en: 'Golden-Masked Enforcer of King Goshtasp' },
      primaryColor: 0xfbbf24,
      secondaryColor: 0xb45309,
      accentColor: 0xfef08a,
      skinColor: 0xfde047,
      armorStyle: 'golden_brazen',
      weaponStyle: 'golden_twin_blades',
      specialTrait: 'golden_visored_mask',
      scale: 1.16,
    },
    goodBoss: {
      id: 'rostam_chachi',
      name: { fa: 'رستم دستان با تیر گز سیمرغ', fa_old: 'رستم تهمتن با کمان چاچی', en: 'Rostam Dastan with the Tamarisk Arrow' },
      title: { fa: 'مدافع آزادگی زابلستان و پرورده سیمرغ', fa_old: 'یل آزادمرد سیستان', en: 'Defender of Zabulistan’s Freedom' },
      primaryColor: 0xd97706,
      secondaryColor: 0x1c1917,
      accentColor: 0xe11d48,
      skinColor: 0xc69c72,
      armorStyle: 'babr_bayan',
      weaponStyle: 'chachi_bow_tamarisk',
      specialTrait: 'simorgh_feather',
      scale: 1.34,
    },
    vanguardNameGood: {
      fa: 'کمانداران زابل و زواره',
      fa_old: 'تیراندازان زابلستان',
      en: 'Chachi Bowmen of Zabulistan',
    },
    vanguardNameEvil: {
      fa: 'گارد زرین‌پوش گشتاسپ و اسفندیار',
      fa_old: 'سواران رویین‌پوش گشتاسپی',
      en: 'Golden Immortals of Goshtasp',
    },
    crossroads: {
      prompt: {
        fa: 'سیمرغ هشدار داده است: «هر کس خون اسفندیار را بریزد، در این جهان رنج بیند و فره از او روی بگرداند.» آیا پیش از رها کردن تیر گز دوشاخه، آخرین پند و پوزش پهلوانی را به جای می‌آوری و پرورش بهمن را می‌پذیری، یا بی‌محابا چشمان او را می‌دوزی؟',
        fa_old: 'سیمرغ راز تیر گز را گشوده اما زنهار داده که خون اسفندیار شوم است. آیا پیمان پرورش بهمن و آیین جوانمردی را به جا می‌آوری یا با کین، تیر گز را در چشمان او می‌نشانی؟',
        en: 'Simorgh warned that whoever sheds Esfandiyar’s blood is cursed by fate. Before loosing the two-pronged Tamarisk Arrow, do you offer one last plea and swear to raise his son Bahman, or shoot in ruthless pride?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: آخرین لابه پهلوانی و پیمان پرورش بهمن', fa_old: 'آیین اشه: پیمان جوانمردی و سرپرستی بهمن', en: 'Path of Asha: Plea for Peace & Swear to Raise Bahman' },
        consequence: { fa: 'آزاده ماندی و وصیت اسفندیار به تو سپرده شد؛ پایداری ایرانشهر حفظ گشت', fa_old: 'نام نیک تهمتن جاودان ماند و پیمان استوار شد', en: 'Honor preserved through tragedy; Esfandiyar entrusted his son to you' },
        stabilityDelta: 14,
        farrDelta: 22,
        attackMultiplierBonus: 0.2,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: رها کردن تیر گز دوشاخه با غرور و نفرین خون', fa_old: 'آیین اهریمن: دوختن دیدگان رویین‌تن به کین', en: 'Path of Ahriman: Loose the Tamarisk Shaft in Defiant Wrath' },
        consequence: { fa: 'تیر گز نقاب زرین را شکافت و قدرتت فزونی یافت، اما نفرین سیمرغ بر سرنوشتت نشست', fa_old: 'تیر گز کارگر افتاد لیکن نفرین خون بر تهمتن نشست', en: 'Lethal precision pierced the golden mask, inviting Simorgh’s curse' },
        stabilityDelta: -16,
        farrDelta: -26,
        attackMultiplierBonus: 0.38,
      },
    },
  },

  // ============================================================================
  // EPOCH 11: SHAGHAD'S TREACHERY, SPEAR-PIT OF KABUL & ROSTAM'S LAST ARROW
  // ============================================================================
  {
    id: 11,
    versionTag: '۱۱.۰',
    title: {
      fa: 'عصر یازدهم: نیرنگ شغاد، چاه نیزه‌دار کابل و آخرین تیر رستم',
      fa_old: 'روزگار یازدهم: نیرنگ شغاد و آخرین تیر تهمتن بر درخت چنار',
      en: 'Epoch XI: Shaghad’s Treachery & Rostam’s Final Arrow',
    },
    subtitle: {
      fa: 'رستم زخم‌خورده با تیرهای فرورفته در زره در برابر شغاد در پناه درخت چنار',
      fa_old: 'تهمتن خسته‌تن در چاه نیزه‌دار در برابر شغاد پیمان‌شکن',
      en: 'Wounded Rostam Pierced by Spears Against Shaghad Behind the Plane Tree',
    },
    loreIntro: {
      fa: 'شغاد نابرادر با شاه کابل همدست شد و در شکارگاه چاه‌هایی پر از تیغ و نیزه کند. رستم و رخش در چاه نیزه‌دار افتادند؛ اما تهمتن با تنی پر از زخم و نیزه، کمان را از شغاد گرفت تا آخرین تیر زندگی‌اش را از میان درخت چنار کهنسال به قلب برادر خائن بدوزد.',
      fa_old: 'رستم و رخش در چاه پر از تیغ و زوبین کابل فروافتادند. شغاد پیمان‌شکن در پسِ درخت چنار پنهان شد، غافل از آنکه بازوی خون‌چکان تهمتن هنوز یارای دوختن چنار و شغاد را به یک تیر دارد.',
      en: 'Betrayed by his half-brother Shaghad, Rostam and Rakhsh fall into a pit bristling with spears. Bleeding and pierced through his armor, Rostam draws his bow one final time toward the hollow Plane Tree where Shaghad hides.',
    },
    environmentTheme: {
      id: 'kabul_hunting_ground',
      skyColor: 0x0f120b,
      fogColor: 0x171c12,
      floorTint: 0x24291e,
      torchColor: 0xea580c,
      hasPlaneTree: true,
      hasSpearPit: true,
    },
    goodHero: {
      id: 'rostam_wounded',
      name: { fa: 'رستم زخم‌خورده (واپسین دم)', fa_old: 'رستم خسته‌تن در چاه کابل', en: 'Wounded Rostam of the Spear-Pit' },
      title: { fa: 'پهلوان خون‌چکان با تیرها و نیزه‌های فرورفته در زره', fa_old: 'شیر زخم‌خورده سیستان با واپسین کمان', en: 'Pierced Champion Drawing His Final Bowstring' },
      primaryColor: 0x9a3412,
      secondaryColor: 0x450a0a,
      accentColor: 0xdc2626,
      skinColor: 0xb08968,
      armorStyle: 'wounded_babr',
      weaponStyle: 'chachi_bow_tamarisk',
      specialTrait: 'embedded_arrows',
      scale: 1.1,
    },
    evilBoss: {
      id: 'shaghad',
      name: { fa: 'شغاد پیمان‌شکن (در پناه چنار)', fa_old: 'شغاد نابرادر و شاه کابل', en: 'Shaghad the Oathbreaker' },
      title: { fa: 'برادر خائن پنهان‌شده در پس درخت چنار', fa_old: 'فریبکار کابل در پناه چنار کهنسال', en: 'Fratricidal Traitor Hiding Behind the Plane Tree' },
      primaryColor: 0x1e293b,
      secondaryColor: 0x0f172a,
      accentColor: 0x84cc16,
      skinColor: 0xa1a1aa,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.28,
    },
    evilCommander: {
      id: 'shaghad',
      name: { fa: 'شغاد و شاه کابل', fa_old: 'شغاد پیمان‌شکن', en: 'Shaghad of Kabul' },
      title: { fa: 'طراح چاه‌های نیزه‌دار شکارگاه کابل', fa_old: 'کشنده رستم به نیرنگ چاه', en: 'Architect of the Spear-Pits of Kabul' },
      primaryColor: 0x1e293b,
      secondaryColor: 0x0f172a,
      accentColor: 0x84cc16,
      skinColor: 0xa1a1aa,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.12,
    },
    goodBoss: {
      id: 'rostam_wounded',
      name: { fa: 'رستم دستان (خشم واپسین)', fa_old: 'رستم تهمتن (واپسین تیر)', en: 'Rostam the Undying Lion' },
      title: { fa: 'شکافنده درخت چنار با آخرین تیر زابلستان', fa_old: 'انتقام‌گیرنده از پس چنار کابل', en: 'Piercer of the Ancient Plane Tree' },
      primaryColor: 0xb45309,
      secondaryColor: 0x7f1d1d,
      accentColor: 0xef4444,
      skinColor: 0xb08968,
      armorStyle: 'wounded_babr',
      weaponStyle: 'chachi_bow_tamarisk',
      specialTrait: 'embedded_arrows',
      scale: 1.32,
    },
    vanguardNameGood: {
      fa: 'یاران وفادار رستم و زواره',
      fa_old: 'همرزمان زواره در کابل',
      en: 'Fallen Retainers of Rostam & Zavareh',
    },
    vanguardNameEvil: {
      fa: 'کمین‌گران و نیزه‌داران شاه کابل',
      fa_old: 'چاه‌کنان و کمین‌گران کابل',
      en: 'Kabul Ambushers & Pit-Spearmen',
    },
    crossroads: {
      prompt: {
        fa: 'با تنی چاک‌چاک از نیزه‌های چاه، کمان را به زه کشیده‌ای و شغاد در پشت تنه ستبر درخت چنار لبخند می‌زند. آیا با نیایش به درگاه یزدان، تیر دادخواهی را از دل چنار می‌گذرانی یا با نفرین بر دودمان خویش، کابل را به آتش کین می‌سپاری؟',
        fa_old: 'شغاد در پس چنار کهنسال پنهان گشته است. آیا به نام یزدان پاک، تیر داد را از میان چنار و قلب خائن می‌گذرانی یا نفرین خون را بر کابل می‌گسترانی؟',
        en: 'Bleeding from a dozen spear wounds, you draw the bowstring as Shaghad cowers inside the hollow Plane Tree. Do you loose the final arrow with a prayer of righteous justice, or curse all of Kabul to burn?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: نیایش یزدان و دوختن شغاد به درخت چنار', fa_old: 'آیین اشه: سپاس یزدان و گذراندن تیر از دل چنار', en: 'Path of Asha: Righteous Prayer & Pierce the Plane Tree' },
        consequence: { fa: 'تیر از تنه چنار گذشت و نام رستم جاودانه شد؛ پایداری ایرانشهر فزونی یافت', fa_old: 'خائن به چنار دوخته شد و فره تهمتن جاودان گشت', en: 'The arrow split the tree and pinned the traitor; Rostam died in eternal glory' },
        stabilityDelta: 20,
        farrDelta: 30,
        attackMultiplierBonus: 0.24,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: نفرین سیاه و سوزاندن کابل توسط فرامرز', fa_old: 'آیین اهریمن: سوگند کین و خاکستر کردن کابل', en: 'Path of Ahriman: Blood Oath to Turn Kabul into Ash' },
        consequence: { fa: 'تیر با خشم اهریمنی شلیک شد و قدرت ویرانگر یافت', fa_old: 'پیکان خون‌آلود چنار را درید و کین کابل افروخته شد', en: 'Unstoppable wrath drove the shaft through bark and bone alike' },
        stabilityDelta: -16,
        farrDelta: -26,
        attackMultiplierBonus: 0.38,
      },
    },
  },

  // ============================================================================
  // EPOCH 12: ROSTAM FARROKHZAD, FERDOWSI & IMMORTALITY OF SHAHNAMEH
  // ============================================================================
  {
    id: 12,
    versionTag: '۱۲.۰',
    title: {
      fa: 'عصر دوازدهم: رستم فرخزاد، حکیم فردوسی و جاودانگی شاهنامه',
      fa_old: 'روزگار دوازدهم: رستم فرخزاد و جاودانگی کاخ بلند فردوسی',
      en: 'Epoch XII: Rostam Farrokhzad, Ferdowsi & Immortal Shahnameh',
    },
    subtitle: {
      fa: 'زره ساسانی ارغوانی و زرین با بال‌های فروهر در برابر دیو فراموشی',
      fa_old: 'سپهبد ایران با درفش کاویانی و فروغ فردوسی در برابر دیو فراموشی',
      en: 'Sassanian Royal Armor & Faravahar Wings Against the Demon of Oblivion',
    },
    loreIntro: {
      fa: 'در واپسین نبرد تاریخ، رستم فرخزاد با زره ساسانی ارغوانی و زرین، بال‌های فروهر و درفش کاویانی تا آخرین نفس ایستادگی می‌کند؛ و سی سال رنج حکیم ابوالقاسم فردوسی در توس، کاخی از نظم پی می‌افکند که از باد و باران و دیو فراموشیگزندی نخواهد یافت.',
      fa_old: 'رستم فرخزاد با جوشن ارغوانی و زرین ساسانی درفش کاویانی را استوار می‌دارد، و حکیم توس با شصت هزار بیت شاهنامه، ایرانشهر را از چنگال دیو فراموشی جاودانه می‌سازد: «بسی رنج بردم در این سال سی / عجم زنده کردم بدین پارسی».',
      en: 'Clad in purple and gold Sassanian cataphract armor with Faravahar wings and the Derafsh Kaviani, Rostam Farrokhzad makes his immortal stand—while Hakim Ferdowsi’s verse banishes the Arch-Demon of Oblivion forever.',
    },
    environmentTheme: {
      id: 'persepolis_eternal_hall',
      skyColor: 0x12091c,
      fogColor: 0x1c0f2b,
      floorTint: 0x241a30,
      torchColor: 0xfbbf24,
    },
    goodHero: {
      id: 'rostam_farrokhzad',
      name: { fa: 'رستم فرخزاد و فروغ فردوسی', fa_old: 'رستم فرخزاد و روان حکیم فردوسی', en: 'Rostam Farrokhzad & Spirit of Ferdowsi' },
      title: { fa: 'سپهبد ایرانشهر با زره ارغوانی، بال‌های فروهر و درفش کاویانی', fa_old: 'واپسین سپهبد ایران با بال‌های فروهر و درفش کاویانی', en: 'Grand Spahbed of Iranshahr in Royal Sassanian Armor' },
      primaryColor: 0x7e22ce,
      secondaryColor: 0xd97706,
      accentColor: 0xfef08a,
      skinColor: 0xd6b496,
      armorStyle: 'sassanian_purple',
      weaponStyle: 'sassanian_lance',
      specialTrait: 'faravahar_wings',
      scale: 1.12,
    },
    evilBoss: {
      id: 'oblivion_div',
      name: { fa: 'دیو فراموشی و اهریمن خاموشی', fa_old: 'اهریمن فراموشی و باد خزان', en: 'Arch-Demon of Oblivion' },
      title: { fa: 'نابودکننده نام و یاد ایرانشهر در غبار زمان', fa_old: 'زمستان اهریمنی و زداینده یاد نیاکان', en: 'Devourer of Memory, History & Sacred Verse' },
      primaryColor: 0x09090b,
      secondaryColor: 0x4c1d95,
      accentColor: 0xef4444,
      skinColor: 0x18181b,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.48,
    },
    evilCommander: {
      id: 'oblivion_div',
      name: { fa: 'دیو فراموشی (اهریمن خاموشی)', fa_old: 'سالار اهریمن فراموشی', en: 'Arch-Demon of Oblivion' },
      title: { fa: 'تاراج‌گر کاخ نظم و تاریخ ایرانشهر', fa_old: 'دشمن زبان پارسی و نام پهلوانان', en: 'Destroyer of the Immortal Palace of Verse' },
      primaryColor: 0x09090b,
      secondaryColor: 0x4c1d95,
      accentColor: 0xef4444,
      skinColor: 0x18181b,
      armorStyle: 'obsidian_demon',
      weaponStyle: 'dark_cleaver',
      specialTrait: 'horned_skull',
      scale: 1.2,
    },
    goodBoss: {
      id: 'rostam_farrokhzad',
      name: { fa: 'رستم فرخزاد و حکیم ابوالقاسم فردوسی', fa_old: 'رستم فرخزاد و حکیم ابوالقاسم فردوسی', en: 'Rostam Farrokhzad & Hakim Ferdowsi' },
      title: { fa: 'نگهبانان جاودان شاهنامه و کاخ بلند پارسی', fa_old: 'پاسداران جاودان کاخ بی‌گزند شاهنامه', en: 'Eternal Guardians of the Immortal Shahnameh' },
      primaryColor: 0x9333ea,
      secondaryColor: 0xf59e0b,
      accentColor: 0xfef08a,
      skinColor: 0xd6b496,
      armorStyle: 'sassanian_purple',
      weaponStyle: 'sassanian_lance',
      specialTrait: 'faravahar_wings',
      scale: 1.36,
    },
    vanguardNameGood: {
      fa: 'سواران جاویدان ساسانی و پاسداران توس',
      fa_old: 'اسواران جاویدان و نگهبانان شاهنامه',
      en: 'Sassanian Aswaran & Guardians of Tus',
    },
    vanguardNameEvil: {
      fa: 'اشباح فراموشی و دیوان تاریکی',
      fa_old: 'دیوان خاموشی و تاراجگران یاد',
      en: 'Wraiths of Oblivion & Silence',
    },
    crossroads: {
      prompt: {
        fa: 'در واپسین پیچ تاریخ، کاخ‌های سنگی فرو می‌ریزند اما کلام حکیم فردوسی در برابر طوفان زمان می‌درخشد: «پسر کو ندارد نشان از پدر... / نمیرم از این پس که من زنده‌ام، که تخم سخن را پراکنده‌ام». سرنوشت نهایی ایرانشهر را چگونه رقم می‌زنی؟',
        fa_old: 'ایوان‌های سنگی در باد و باران زمان فرو می‌شکنند، لیکن کاخ بلند نظم فردوسی استوار است. سرانجام این رزم دوازده‌گانه را بر کدام آیین مهر می‌نهی؟',
        en: 'Stone palaces crumble to dust, yet Hakim Ferdowsi’s verse stands defiant against time: "I shall not die, for I have sown the seeds of the Persian word." How do you seal the final destiny of Shahnameh?',
      },
      ashaChoice: {
        title: { fa: 'فروغ اشه: جاودانه ساختن شاهنامه و رستاخیز نور ایرانشهر', fa_old: 'آیین اشه: برافراشتن کاخ بی‌گزند شاهنامه تا ابد', en: 'Path of Asha: Immortalize the Shahnameh in Eternal Light' },
        consequence: { fa: 'کاخ بلند شاهنامه جاودان شد و ایرانشهر به اوج پایداری و فره ایزدی رسید', fa_old: 'عجم زنده گشت بدین پارسی و فره ایزدی جاودان شد', en: 'The Palace of Verse stands immortal; Iranshahr ascends in radiant glory' },
        stabilityDelta: 25,
        farrDelta: 35,
        attackMultiplierBonus: 0.28,
      },
      ahrimanChoice: {
        title: { fa: 'خشم اهریمن: فرمانروایی بر تخت خاکستر و آهن', fa_old: 'آیین اهریمن: چیرگی بر اورنگ خاکستر و خون', en: 'Path of Ahriman: Claim the Throne of Ash and Iron' },
        consequence: { fa: 'قدرت مطلق تاریکی آزاد شد و جهان در زیر سم اسبان آهنین لرزید', fa_old: 'تیغ اهریمنی بر جهان چیره گشت و زمین در خون نشست', en: 'Absolute dark dominion unleashed across an empire of ash' },
        stabilityDelta: -25,
        farrDelta: -35,
        attackMultiplierBonus: 0.45,
      },
    },
  },
];
