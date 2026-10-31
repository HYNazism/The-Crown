import { CharacterVisualSpec, EpochData, Faction, SHAHNAMEH_EPOCHS } from './epochs';

export type BattlePhase = 'vanguard' | 'crossroads' | 'boss_duel' | 'victory' | 'defeat';

export type EnemyBehaviorPolicy = 'swarmer' | 'ranged' | 'charger' | 'boss_1v1';

export type GoreIntensity = 'low' | 'medium' | 'brutal';
export type DifficultyLevel = 'story' | 'heroic' | 'mythic';
export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra';
export type CameraPerspective = '3d' | '2d';

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  muted: boolean;
  graphicsQuality: GraphicsQuality;
  cameraMode: CameraPerspective;
  cameraShake: boolean;
  goreIntensity: GoreIntensity;
  difficulty: DifficultyLevel;
}

export const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 85,
  sfxVolume: 90,
  musicVolume: 75,
  muted: false,
  graphicsQuality: 'high',
  cameraMode: '3d',
  cameraShake: true,
  goreIntensity: 'brutal',
  difficulty: 'heroic',
};

export interface ResolvedEpochRoles {
  epoch: EpochData;
  playerSpec: CharacterVisualSpec;
  bossSpec: CharacterVisualSpec;
  vanguardSpecs: CharacterVisualSpec[];
  enemyArmyTitle: EpochData['vanguardNameEvil'];
}

/**
 * Resolves the exact player character, vanguard enemy army, and 1v1 final boss
 * based on the chosen faction (Good/Asha vs. Evil/Ahriman) for any of the 12 epochs.
 */
export function resolveEpochRoles(epochId: number, faction: Faction): ResolvedEpochRoles {
  const epoch =
    SHAHNAMEH_EPOCHS.find((e) => e.id === epochId) ?? SHAHNAMEH_EPOCHS[0];

  if (faction === 'asha') {
    return {
      epoch,
      playerSpec: epoch.goodHero,
      bossSpec: epoch.evilBoss,
      vanguardSpecs: [
        {
          ...epoch.evilBoss,
          scale: 0.92,
        },
      ],
      enemyArmyTitle: epoch.vanguardNameEvil,
    };
  } else {
    // Complete inversion: Player plays as the Evil Commander of that Epoch,
    // fighting Iranshahr's vanguard soldiers and the Heroic Boss of that Epoch!
    return {
      epoch,
      playerSpec: epoch.evilCommander,
      bossSpec: epoch.goodBoss,
      vanguardSpecs: [
        {
          ...epoch.goodHero,
          scale: 0.92,
        },
      ],
      enemyArmyTitle: epoch.vanguardNameGood,
    };
  }
}

export interface ArterialBloodDrop {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  settled: boolean;
}

export interface DismemberedPart {
  partType: 'head' | 'arm' | 'torso_cleave';
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  color: number;
}

/**
 * Computes realistic arterial blood spray aligned with the weapon strike vector
 * and physical gravity.
 */
export function computeArterialSpray(
  originX: number,
  originY: number,
  originZ: number,
  strikeDirX: number,
  strikeDirZ: number,
  goreIntensity: GoreIntensity,
  isFinisher: boolean,
  seed = 0.5,
): ArterialBloodDrop[] {
  const len = Math.hypot(strikeDirX, strikeDirZ) || 1;
  const nx = strikeDirX / len;
  const nz = strikeDirZ / len;

  const baseCount =
    goreIntensity === 'low' ? 5 : goreIntensity === 'medium' ? 14 : 26;
  const count = isFinisher ? Math.round(baseCount * 1.6) : baseCount;
  const drops: ArterialBloodDrop[] = [];

  for (let i = 0; i < count; i++) {
    const t = ((i + 1) / count + seed) % 1;
    const spreadAngle = (t - 0.5) * 0.85;
    const cos = Math.cos(spreadAngle);
    const sin = Math.sin(spreadAngle);
    const dirX = nx * cos - nz * sin;
    const dirZ = nx * sin + nz * cos;
    const speed = (isFinisher ? 8.5 : 5.5) * (0.65 + 0.7 * ((i * 7 + 3) % 10) / 10);
    const up = (isFinisher ? 5.8 : 3.6) * (0.5 + 0.6 * ((i * 13 + 5) % 10) / 10);

    drops.push({
      x: originX,
      y: originY,
      z: originZ,
      vx: dirX * speed,
      vy: up,
      vz: dirZ * speed,
      size: goreIntensity === 'brutal' ? 0.16 + (i % 3) * 0.05 : 0.11,
      settled: false,
    });
  }
  return drops;
}

/**
 * Advances arterial blood particles under gravity (-18 m/s^2) and settles them onto the floor (y = 0.02).
 */
export function stepBloodPhysics(drops: ArterialBloodDrop[], dt: number): void {
  const gravity = -18.5;
  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    if (d.settled) continue;
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    d.z += d.vz * dt;
    d.vy += gravity * dt;
    if (d.y <= 0.02) {
      d.y = 0.02;
      d.vx = 0;
      d.vy = 0;
      d.vz = 0;
      d.settled = true;
    }
  }
}

/**
 * Determines whether a killing blow triggers logical dismemberment and returns the impulse vector.
 */
export function computeFinisherDismemberment(
  targetX: number,
  targetZ: number,
  strikeDirX: number,
  strikeDirZ: number,
  goreIntensity: GoreIntensity,
  armorColor: number,
): DismemberedPart | null {
  if (goreIntensity === 'low') return null;
  const len = Math.hypot(strikeDirX, strikeDirZ) || 1;
  const nx = strikeDirX / len;
  const nz = strikeDirZ / len;

  return {
    partType: goreIntensity === 'brutal' ? 'head' : 'arm',
    x: targetX,
    y: 1.4,
    z: targetZ,
    vx: nx * 6.5,
    vy: 5.2,
    vz: nz * 6.5,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    color: armorColor,
  };
}

export interface CampaignState {
  currentEpochId: number;
  highestUnlockedEpoch: number;
  faction: Faction;
  iranshahrStability: number; // 0 to 100
  alignmentScore: number; // -100 (Pure Ahriman) to +100 (Pure Asha)
  attackMultiplier: number;
  decisionsByEpoch: Record<number, Faction>;
}

export function createInitialCampaignState(faction: Faction = 'asha'): CampaignState {
  return {
    currentEpochId: 1,
    highestUnlockedEpoch: 12, // All 12 epochs accessible for direct inspection or sequential campaign
    faction,
    iranshahrStability: faction === 'asha' ? 75 : 45,
    alignmentScore: faction === 'asha' ? 40 : -40,
    attackMultiplier: 1.0,
    decisionsByEpoch: {},
  };
}

export function applyMoralCrossroadsChoice(
  state: CampaignState,
  epoch: EpochData,
  chosenPath: Faction,
): CampaignState {
  const outcome =
    chosenPath === 'asha'
      ? epoch.crossroads.ashaChoice
      : epoch.crossroads.ahrimanChoice;

  const nextStability = Math.max(
    5,
    Math.min(100, state.iranshahrStability + outcome.stabilityDelta),
  );
  const nextAlignment = Math.max(
    -100,
    Math.min(100, state.alignmentScore + outcome.farrDelta),
  );
  const nextMultiplier = Number(
    (state.attackMultiplier + outcome.attackMultiplierBonus).toFixed(2),
  );

  return {
    ...state,
    iranshahrStability: nextStability,
    alignmentScore: nextAlignment,
    attackMultiplier: nextMultiplier,
    decisionsByEpoch: {
      ...state.decisionsByEpoch,
      [epoch.id]: chosenPath,
    },
  };
}

export function calculateAttackDamage(
  baseDamage: number,
  attackMultiplier: number,
  difficulty: DifficultyLevel,
  isPlayerAttacker: boolean,
): number {
  if (isPlayerAttacker) {
    const diffScale =
      difficulty === 'story' ? 1.35 : difficulty === 'heroic' ? 1.0 : 0.85;
    return Math.max(1, Math.round(baseDamage * attackMultiplier * diffScale));
  } else {
    const enemyScale =
      difficulty === 'story' ? 0.65 : difficulty === 'heroic' ? 1.0 : 1.35;
    return Math.max(1, Math.round(baseDamage * enemyScale));
  }
}
