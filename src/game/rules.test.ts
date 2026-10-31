import test from 'node:test';
import assert from 'node:assert/strict';
import { SHAHNAMEH_EPOCHS } from './epochs';
import { formatNum, DICTIONARY } from './i18n';
import {
  resolveEpochRoles,
  computeArterialSpray,
  stepBloodPhysics,
  computeFinisherDismemberment,
  createInitialCampaignState,
  applyMoralCrossroadsChoice,
  calculateAttackDamage,
} from './rules';

test('All 12 Shahnameh epochs exist with complete visual traits and moral crossroads', () => {
  assert.equal(SHAHNAMEH_EPOCHS.length, 12);
  for (let i = 0; i < 12; i++) {
    const ep = SHAHNAMEH_EPOCHS[i];
    assert.equal(ep.id, i + 1);
    assert.ok(ep.goodHero.name.fa.length > 0);
    assert.ok(ep.evilBoss.name.fa.length > 0);
    assert.ok(ep.evilCommander.name.fa.length > 0);
    assert.ok(ep.goodBoss.name.fa.length > 0);
  }
  // Verify specific epoch canonical traits requested by user
  assert.equal(SHAHNAMEH_EPOCHS[0].goodHero.armorStyle, 'leopard_fur');
  assert.equal(SHAHNAMEH_EPOCHS[1].goodHero.armorStyle, 'bare_sash');
  assert.equal(SHAHNAMEH_EPOCHS[2].goodHero.specialTrait, 'left_fire_orb');
  assert.equal(SHAHNAMEH_EPOCHS[3].goodHero.specialTrait, 'left_golden_lasso');
  assert.equal(SHAHNAMEH_EPOCHS[4].goodHero.specialTrait, 'derafsh_kaviani');
  assert.equal(SHAHNAMEH_EPOCHS[4].evilBoss.specialTrait, 'shoulder_serpents');
  assert.equal(SHAHNAMEH_EPOCHS[5].goodHero.weaponStyle, 'bull_mace');
  assert.equal(SHAHNAMEH_EPOCHS[6].goodHero.armorStyle, 'babr_bayan');
  assert.equal(SHAHNAMEH_EPOCHS[6].evilBoss.weaponStyle, 'millstone');
  assert.equal(SHAHNAMEH_EPOCHS[7].goodHero.specialTrait, 'tahmineh_armlet');
  assert.equal(SHAHNAMEH_EPOCHS[8].goodHero.specialTrait, 'sacred_fire_halo');
  assert.equal(SHAHNAMEH_EPOCHS[9].goodHero.weaponStyle, 'chachi_bow_tamarisk');
  assert.equal(SHAHNAMEH_EPOCHS[9].evilBoss.specialTrait, 'golden_visored_mask');
  assert.equal(SHAHNAMEH_EPOCHS[10].goodHero.specialTrait, 'embedded_arrows');
  assert.equal(SHAHNAMEH_EPOCHS[11].goodHero.specialTrait, 'faravahar_wings');
});

test('Faction inversion flips player character, vanguard army, and 1v1 boss', () => {
  const goodEpoch1 = resolveEpochRoles(1, 'asha');
  assert.equal(goodEpoch1.playerSpec.id, 'keyumars');
  assert.equal(goodEpoch1.bossSpec.id, 'khazarvan_div');

  const evilEpoch1 = resolveEpochRoles(1, 'ahriman');
  assert.equal(evilEpoch1.playerSpec.id, 'khazarvan_div');
  assert.equal(evilEpoch1.bossSpec.id, 'sorush_angel');

  const evilEpoch5 = resolveEpochRoles(5, 'ahriman');
  assert.equal(evilEpoch5.playerSpec.id, 'zahhak');
  assert.equal(evilEpoch5.bossSpec.id, 'kaveh');
});

test('Language purity and numeral formatting work without cross-language mixing', () => {
  assert.equal(formatNum(12, 'fa'), '۱۲');
  assert.equal(formatNum(100, 'fa_old'), '۱۰۰');
  assert.equal(formatNum('۱۲', 'en'), '12');
  assert.equal(formatNum(95, 'en'), '95');

  // Ensure Persian dictionary has zero Latin characters
  for (const [key, val] of Object.entries(DICTIONARY.fa)) {
    assert.equal(
      /[A-Za-z]/.test(val),
      false,
      `Persian string "${key}" contains Latin letters: ${val}`,
    );
  }
});

test('Arterial blood physics aligns with weapon strike vector and settles under gravity', () => {
  const drops = computeArterialSpray(0, 1.2, 0, 1, 0, 'brutal', true);
  assert.ok(drops.length >= 30);
  // Average X velocity must be positive along the +X strike vector
  const avgVx = drops.reduce((acc, d) => acc + d.vx, 0) / drops.length;
  assert.ok(avgVx > 2.0);

  // Step physics for 1.5 seconds so drops hit the floor
  for (let i = 0; i < 30; i++) {
    stepBloodPhysics(drops, 0.05);
  }
  assert.ok(drops.every((d) => d.settled && d.y === 0.02));

  const dismember = computeFinisherDismemberment(2, 3, 1, 0, 'brutal', 0xff0000);
  assert.ok(dismember !== null);
  assert.equal(dismember?.partType, 'head');
  assert.ok((dismember?.vx ?? 0) > 0);
});

test('Moral crossroads permanently updates Iranshahr stability, alignment, and attack power', () => {
  const initial = createInitialCampaignState('asha');
  const afterAsha = applyMoralCrossroadsChoice(initial, SHAHNAMEH_EPOCHS[0], 'asha');
  assert.ok(afterAsha.iranshahrStability > initial.iranshahrStability);
  assert.ok(afterAsha.alignmentScore > initial.alignmentScore);
  assert.ok(afterAsha.attackMultiplier > initial.attackMultiplier);

  const afterAhriman = applyMoralCrossroadsChoice(initial, SHAHNAMEH_EPOCHS[0], 'ahriman');
  assert.ok(afterAhriman.iranshahrStability < initial.iranshahrStability);
  assert.ok(afterAhriman.alignmentScore < initial.alignmentScore);
  assert.ok(afterAhriman.attackMultiplier > afterAsha.attackMultiplier);

  const dmg = calculateAttackDamage(25, afterAhriman.attackMultiplier, 'heroic', true);
  assert.ok(dmg > 25);
});
