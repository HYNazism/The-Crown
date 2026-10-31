import * as THREE from 'three';
import { CharacterVisualSpec } from './epochs';

export interface ArticulatedActorRig {
  root: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  cape: THREE.Mesh;
  weaponGroup: THREE.Group;
  hitFlashMaterials: THREE.MeshStandardMaterial[];
}

const textureCache = new Map<string, THREE.CanvasTexture>();

export function getProceduralPatternTexture(
  pattern: 'leopard' | 'babr_tiger' | 'scale_armor' | 'basalt' | 'kaveh_banner',
): THREE.CanvasTexture {
  if (textureCache.has(pattern)) {
    return textureCache.get(pattern)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  if (pattern === 'leopard') {
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 42; i++) {
      const x = ((i * 53) % 240) + 8;
      const y = ((i * 97) % 240) + 8;
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'babr_tiger') {
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#18181b';
    for (let y = 10; y < 250; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(128, y + 12, 256, y - 4);
      ctx.lineTo(256, y + 6);
      ctx.quadraticCurveTo(128, y + 20, 0, y + 8);
      ctx.fill();
    }
  } else if (pattern === 'scale_armor') {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 12; col++) {
        const cx = col * 22 + (row % 2) * 11;
        const cy = row * 16;
        ctx.beginPath();
        ctx.arc(cx, cy, 11, 0, Math.PI);
        ctx.stroke();
      }
    }
  } else if (pattern === 'kaveh_banner') {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 10;
    ctx.strokeRect(12, 12, 232, 232);
    // Four-pointed Derafsh Kaviani star (Akhtar-e Kaviani)
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(128, 36);
    ctx.lineTo(154, 102);
    ctx.lineTo(220, 128);
    ctx.lineTo(154, 154);
    ctx.lineTo(128, 220);
    ctx.lineTo(102, 154);
    ctx.lineTo(36, 128);
    ctx.lineTo(102, 102);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.arc(128, 128, 22, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Persepolis carved dark basalt stone floor with relief joints & rosette motifs
    ctx.fillStyle = '#36322f';
    ctx.fillRect(0, 0, 256, 256);
    // Stone slab bevel highlights
    ctx.strokeStyle = '#57534e';
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, 116, 116);
    ctx.strokeRect(134, 6, 116, 116);
    ctx.strokeRect(6, 134, 116, 116);
    ctx.strokeRect(134, 134, 116, 116);
    // Deep mortar seams
    ctx.strokeStyle = '#141210';
    ctx.lineWidth = 5;
    ctx.strokeRect(2, 2, 124, 124);
    ctx.strokeRect(130, 2, 124, 124);
    ctx.strokeRect(2, 130, 124, 124);
    ctx.strokeRect(130, 130, 124, 124);
    // Subtle carved inner borders & weathered cracks
    ctx.strokeStyle = '#78716c';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, 96, 96);
    ctx.strokeRect(144, 144, 96, 96);
    ctx.fillStyle = '#a8a29e';
    ctx.beginPath();
    ctx.arc(64, 64, 6, 0, Math.PI * 2);
    ctx.arc(192, 192, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  textureCache.set(pattern, tex);
  return tex;
}

/**
 * Builds an articulated 10-14 part 3D character mesh matching the exact Shahnameh
 * epoch visual specification (armor, weapon, beard/crown, serpents, wings, banners).
 */
export function buildCharacterRig(spec: CharacterVisualSpec): ArticulatedActorRig {
  const root = new THREE.Group();
  root.scale.setScalar(spec.scale);

  const hitFlashMaterials: THREE.MeshStandardMaterial[] = [];

  const registerMat = (mat: THREE.MeshStandardMaterial) => {
    hitFlashMaterials.push(mat);
    return mat;
  };

  // Contact shadow disc at ground level (y = 0.015)
  const shadowGeo = new THREE.CircleGeometry(0.75, 20);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.position.y = 0.015;
  root.add(shadowDisc);

  // Select armor texture based on style
  const armorMap =
    spec.armorStyle === 'leopard_fur'
      ? getProceduralPatternTexture('leopard')
      : spec.armorStyle === 'babr_bayan' || spec.armorStyle === 'wounded_babr'
      ? getProceduralPatternTexture('babr_tiger')
      : spec.armorStyle === 'lapis_scale' ||
        spec.armorStyle === 'emerald_royal' ||
        spec.armorStyle === 'turquoise_youth' ||
        spec.armorStyle === 'sassanian_purple' ||
        spec.armorStyle === 'golden_brazen'
      ? getProceduralPatternTexture('scale_armor')
      : null;

  const primaryMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: armorMap ? 0xffffff : spec.primaryColor,
      map: armorMap,
      roughness: spec.armorStyle === 'golden_brazen' ? 0.2 : 0.48,
      metalness:
        spec.armorStyle === 'golden_brazen'
          ? 0.9
          : spec.armorStyle === 'leopard_fur' || spec.armorStyle === 'bare_sash'
          ? 0.15
          : 0.65,
    }),
  );
  if (armorMap && spec.armorStyle !== 'leopard_fur' && spec.armorStyle !== 'babr_bayan') {
    primaryMat.color.setHex(spec.primaryColor);
  }

  const secondaryMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: spec.secondaryColor,
      roughness: 0.65,
      metalness: 0.35,
    }),
  );

  const accentMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: spec.accentColor,
      roughness: 0.25,
      metalness: 0.85,
      emissive: spec.accentColor,
      emissiveIntensity: 0.18,
    }),
  );

  const skinMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: spec.skinColor,
      roughness: 0.72,
      metalness: 0.08,
    }),
  );

  // 1. Torso & Cuirass (Jawshan)
  const torso = new THREE.Group();
  torso.position.y = 1.05;
  root.add(torso);

  const chestMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.28, 0.78, 12),
    spec.armorStyle === 'bare_sash' ? skinMat : primaryMat,
  );
  chestMesh.castShadow = true;
  torso.add(chestMesh);

  // Siamak's diagonal leopard sash or Kaveh's leather apron
  if (spec.armorStyle === 'bare_sash') {
    const sash = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.08, 8, 18),
      new THREE.MeshStandardMaterial({
        map: getProceduralPatternTexture('leopard'),
        roughness: 0.7,
      }),
    );
    sash.rotation.z = Math.PI / 4;
    sash.rotation.x = Math.PI / 2;
    torso.add(sash);
  } else if (spec.armorStyle === 'blacksmith_apron') {
    const apron = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.86, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x5c2d0c, roughness: 0.85 }),
    );
    apron.position.set(0, -0.1, 0.28);
    torso.add(apron);
  }

  // Belt & Tassets
  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.31, 0.36, 0.22, 12),
    accentMat,
  );
  belt.position.y = -0.36;
  torso.add(belt);

  // Pauldrons (Shoulder Guards)
  const leftPauldron = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6),
    secondaryMat,
  );
  leftPauldron.position.set(-0.42, 0.28, 0);
  torso.add(leftPauldron);

  const rightPauldron = leftPauldron.clone();
  rightPauldron.position.set(0.42, 0.28, 0);
  torso.add(rightPauldron);

  // 2. Cape / Mantle
  const capeGeo = new THREE.PlaneGeometry(0.68, 1.05, 4, 6);
  capeGeo.translate(0, -0.5, 0);
  const capeMat = new THREE.MeshStandardMaterial({
    color: spec.secondaryColor,
    roughness: 0.8,
    side: THREE.DoubleSide,
  });
  const cape = new THREE.Mesh(capeGeo, capeMat);
  cape.position.set(0, 0.32, -0.3);
  cape.rotation.x = 0.18;
  torso.add(cape);

  // 3. Head, Helmet, Beard & Crown
  const head = new THREE.Group();
  head.position.y = 0.58;
  torso.add(head);

  const headSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 14, 14),
    spec.specialTrait === 'golden_visored_mask' ? accentMat : skinMat,
  );
  head.add(headSphere);

  // Eyes / Visor slit
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.05, 0.12),
    new THREE.MeshBasicMaterial({
      color: spec.armorStyle === 'obsidian_demon' ? 0xef4444 : 0xfef08a,
    }),
  );
  visor.position.set(0, 0.03, 0.18);
  head.add(visor);

  // Beards (Keyumars white beard, Rostam forked beard, or clean-shaven Sohrab)
  if (spec.specialTrait === 'white_beard_crown') {
    const whiteBeard = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 0.34, 8),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 }),
    );
    whiteBeard.rotation.x = Math.PI;
    whiteBeard.position.set(0, -0.18, 0.14);
    head.add(whiteBeard);
  } else if (spec.specialTrait === 'simorgh_feather' || spec.specialTrait === 'embedded_arrows') {
    // Rostam's iconic forked beard (ریش دوشاخه)
    const beardMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.85 });
    const leftFork = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.28, 6), beardMat);
    leftFork.rotation.x = Math.PI;
    leftFork.rotation.z = -0.22;
    leftFork.position.set(-0.07, -0.18, 0.15);
    const rightFork = leftFork.clone();
    rightFork.rotation.z = 0.22;
    rightFork.position.x = 0.07;
    head.add(leftFork, rightFork);
  }

  // Helmet / Crown / Horns
  const crown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.21, 0.18, 10),
    accentMat,
  );
  crown.position.y = 0.16;
  head.add(crown);

  if (spec.specialTrait === 'simorgh_feather') {
    // Crimson Simorgh Feather plume on Rostam's helmet
    const plume = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.48, 8),
      new THREE.MeshStandardMaterial({
        color: 0xe11d48,
        emissive: 0xbe123c,
        emissiveIntensity: 0.4,
      }),
    );
    plume.position.set(0, 0.42, -0.05);
    plume.rotation.x = -0.35;
    head.add(plume);
  } else if (spec.specialTrait === 'horned_skull') {
    // Demon curved horns
    const hornGeo = new THREE.ConeGeometry(0.07, 0.42, 8);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3 });
    const leftHorn = new THREE.Mesh(hornGeo, hornMat);
    leftHorn.position.set(-0.22, 0.3, 0);
    leftHorn.rotation.z = 0.55;
    const rightHorn = new THREE.Mesh(hornGeo, hornMat);
    rightHorn.position.set(0.22, 0.3, 0);
    rightHorn.rotation.z = -0.55;
    head.add(leftHorn, rightHorn);
  }

  // 4. Special Epoch Traits on Torso/Shoulders
  if (spec.specialTrait === 'shoulder_serpents') {
    // Zahhak's two writhing black serpents on his shoulders
    const serpentMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.25,
      metalness: 0.5,
    });
    [-0.44, 0.44].forEach((sx) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sx, 0.25, 0),
        new THREE.Vector3(sx * 1.25, 0.55, 0.12),
        new THREE.Vector3(sx * 0.95, 0.78, 0.28),
      ]);
      const snakeMesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 12, 0.055, 8, false),
        serpentMat,
      );
      torso.add(snakeMesh);
    });
  } else if (spec.specialTrait === 'derafsh_kaviani') {
    // Kaveh's raised Derafsh Kaviani banner on back
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.9, 8),
      accentMat,
    );
    pole.position.set(0, 0.7, -0.32);
    torso.add(pole);

    const bannerPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.65, 0.85),
      new THREE.MeshStandardMaterial({
        map: getProceduralPatternTexture('kaveh_banner'),
        side: THREE.DoubleSide,
        roughness: 0.4,
      }),
    );
    bannerPlane.position.set(0, 1.05, -0.34);
    torso.add(bannerPlane);
  } else if (spec.specialTrait === 'golden_wings' || spec.specialTrait === 'faravahar_wings') {
    // Sorush or Rostam Farrokhzad's Faravahar golden wings
    const wingGeo = new THREE.BoxGeometry(0.75, 0.28, 0.04);
    const leftWing = new THREE.Mesh(wingGeo, accentMat);
    leftWing.position.set(-0.55, 0.35, -0.25);
    leftWing.rotation.z = 0.35;
    const rightWing = new THREE.Mesh(wingGeo, accentMat);
    rightWing.position.set(0.55, 0.35, -0.25);
    rightWing.rotation.z = -0.35;
    torso.add(leftWing, rightWing);
  } else if (spec.specialTrait === 'sacred_fire_halo') {
    // Siavash's ring of sacred fire encircling him
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.055, 8, 28),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -0.7;
    torso.add(halo);
  } else if (spec.specialTrait === 'embedded_arrows') {
    // Wounded Rostam (Epoch 11) with arrows/spear tips protruding from his armor
    const shaftGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.65, 6);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7 });
    for (let i = 0; i < 4; i++) {
      const arrow = new THREE.Mesh(shaftGeo, shaftMat);
      arrow.position.set((i - 1.5) * 0.14, 0.05 + (i % 2) * 0.15, 0.32);
      arrow.rotation.x = 1.1;
      arrow.rotation.z = (i - 1.5) * 0.2;
      torso.add(arrow);
    }
  }

  // 5. Left & Right Articulated Arms
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.46, 0.24, 0);
  torso.add(leftArm);

  const armGeo = new THREE.CylinderGeometry(0.1, 0.085, 0.62, 8);
  armGeo.translate(0, -0.28, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, secondaryMat);
  leftArm.add(leftArmMesh);

  // Off-hand iconic props (Hushang's Sadeh Fire-Stone orb, Tahmuras's Golden Lasso)
  if (spec.specialTrait === 'left_fire_orb') {
    const fireOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff5500 }),
    );
    fireOrb.position.set(0, -0.58, 0.12);
    leftArm.add(fireOrb);
  } else if (spec.specialTrait === 'left_golden_lasso') {
    const lassoCoil = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.035, 8, 20),
      accentMat,
    );
    lassoCoil.position.set(0, -0.56, 0.1);
    leftArm.add(lassoCoil);
  }

  const rightArm = new THREE.Group();
  rightArm.position.set(0.46, 0.24, 0);
  torso.add(rightArm);

  const rightArmMesh = new THREE.Mesh(armGeo, secondaryMat);
  rightArm.add(rightArmMesh);

  // Sohrab's glowing Tahmineh Armlet on right arm
  if (spec.specialTrait === 'tahmineh_armlet') {
    const armlet = new THREE.Mesh(
      new THREE.TorusGeometry(0.115, 0.03, 8, 16),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee }),
    );
    armlet.rotation.x = Math.PI / 2;
    armlet.position.set(0, -0.22, 0);
    rightArm.add(armlet);
  }

  // 6. Weapon Group mounted in Right Hand
  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0, -0.56, 0.1);
  rightArm.add(weaponGroup);

  const shaftMat = new THREE.MeshStandardMaterial({
    color: 0x57534e,
    roughness: 0.6,
    metalness: 0.4,
  });
  const bladeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.18,
    metalness: 0.92,
  });

  if (spec.weaponStyle === 'bull_mace') {
    // Gorz-e Gavsar (Golden Bull-Headed Mace with horns)
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.25, 8), shaftMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.z = 0.45;
    const bullHead = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), accentMat);
    bullHead.position.z = 1.05;
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.28, 6), accentMat);
    hornL.position.set(-0.2, 0.1, 1.1);
    hornL.rotation.z = 0.8;
    const hornR = hornL.clone();
    hornR.position.x = 0.2;
    hornR.rotation.z = -0.8;
    weaponGroup.add(handle, bullHead, hornL, hornR);
  } else if (spec.weaponStyle === 'millstone') {
    // Div-e Sepid's massive stone millstone (سنگ آسیاب)
    const millstone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.52, 0.22, 18),
      new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.9 }),
    );
    millstone.position.z = 0.55;
    weaponGroup.add(millstone);
  } else if (spec.weaponStyle === 'chachi_bow_tamarisk') {
    // Rostam's Chachi Bow & Two-Pronged Tamarisk Arrow (تیر گز دوشاخه)
    const bowArc = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.035, 8, 20, Math.PI),
      accentMat,
    );
    bowArc.rotation.y = Math.PI / 2;
    bowArc.position.z = 0.35;
    const arrowShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.1, 6),
      new THREE.MeshStandardMaterial({ color: 0xd97706 }),
    );
    arrowShaft.rotation.x = Math.PI / 2;
    arrowShaft.position.z = 0.55;
    // Two-pronged tip (دوشاخه)
    const prongL = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 6), accentMat);
    prongL.rotation.x = Math.PI / 2;
    prongL.rotation.y = -0.25;
    prongL.position.set(-0.06, 0, 1.12);
    const prongR = prongL.clone();
    prongR.rotation.y = 0.25;
    prongR.position.x = 0.06;
    weaponGroup.add(bowArc, arrowShaft, prongL, prongR);
  } else if (spec.weaponStyle === 'smith_hammer') {
    // Kaveh's heavy blacksmith sledgehammer
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), shaftMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.z = 0.45;
    const headBlock = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.26, 0.26), bladeMat);
    headBlock.position.z = 1.02;
    weaponGroup.add(handle, headBlock);
  } else if (spec.weaponStyle === 'fire_axe') {
    // Hushang's crimson Fire-Axe
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.2, 8), shaftMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.z = 0.45;
    const axeBlade = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.42, 4),
      new THREE.MeshStandardMaterial({
        color: 0xea580c,
        emissive: 0xdc2626,
        emissiveIntensity: 0.45,
      }),
    );
    axeBlade.position.set(0, 0.12, 0.98);
    weaponGroup.add(handle, axeBlade);
  } else if (spec.weaponStyle === 'stone_mace') {
    // Keyumars & Siamak's rugged Alborz Stone Mace (گرز سنگی)
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.045, 1.15, 8),
      new THREE.MeshStandardMaterial({ color: 0x5c2d0c, roughness: 0.85 }),
    );
    handle.rotation.x = Math.PI / 2;
    handle.position.z = 0.45;
    const boulderHead = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.26, 0),
      new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9, metalness: 0.1 }),
    );
    boulderHead.position.z = 1.02;
    weaponGroup.add(handle, boulderHead);
  } else if (spec.weaponStyle === 'steel_mace_lasso') {
    // Tahmuras's Steel Flanged Mace (گرز پولادین)
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.2, 8), shaftMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.z = 0.45;
    const maceHead = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), bladeMat);
    maceHead.position.z = 1.04;
    weaponGroup.add(handle, maceHead);
  } else if (spec.weaponStyle === 'twin_fangs') {
    // Zahhak's curved serpent fang blades
    const fangL = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.16, 1.25),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.8, roughness: 0.25 }),
    );
    fangL.position.set(-0.08, 0, 0.6);
    const fangR = fangL.clone();
    fangR.position.x = 0.08;
    weaponGroup.add(fangL, fangR);
  } else {
    // Shamshir / Lance / Cleaver
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.14, 1.35),
      spec.weaponStyle === 'golden_twin_blades' ? accentMat : bladeMat,
    );
    blade.position.z = 0.65;
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.08), accentMat);
    guard.position.z = 0.12;
    weaponGroup.add(blade, guard);
  }

  // 7. Articulated Left & Right Legs
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.18, 0.65, 0);
  root.add(leftLeg);

  const legGeo = new THREE.CylinderGeometry(0.12, 0.095, 0.65, 8);
  legGeo.translate(0, -0.32, 0);
  const leftLegMesh = new THREE.Mesh(legGeo, secondaryMat);
  leftLeg.add(leftLegMesh);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.18, 0.65, 0);
  root.add(rightLeg);

  const rightLegMesh = new THREE.Mesh(legGeo, secondaryMat);
  rightLeg.add(rightLegMesh);

  return {
    root,
    torso,
    head,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    cape,
    weaponGroup,
    hitFlashMaterials,
  };
}

/**
 * Animates the articulated 3D character rig each frame based on locomotion gait,
 * attack swing phases (windup -> active -> recovery), and cape flow.
 */
export function updateCharacterRigAnimation(
  rig: ArticulatedActorRig,
  walkDistance: number,
  isMoving: boolean,
  attackTimer: number,
  attackDuration: number,
  elapsedTime: number,
  hitFlashTimer: number,
): void {
  // Gait cycle synced to distance traveled
  const stridePhase = walkDistance * 3.2;
  const legSwing = isMoving ? Math.sin(stridePhase) * 0.62 : 0;

  rig.leftLeg.rotation.x = legSwing;
  rig.rightLeg.rotation.x = -legSwing;
  rig.leftArm.rotation.x = -legSwing * 0.65;

  // Cape billowing
  rig.cape.rotation.x =
    0.22 + (isMoving ? 0.38 : 0.08) + Math.sin(elapsedTime * 5.5) * 0.08;

  // Weapon swing & torso rotation during attack
  if (attackTimer > 0 && attackDuration > 0) {
    const progress = 1 - attackTimer / attackDuration;
    if (progress < 0.28) {
      // Windup
      const w = progress / 0.28;
      rig.rightArm.rotation.x = -1.85 * w;
      rig.torso.rotation.y = -0.45 * w;
    } else if (progress < 0.68) {
      // Active cleave
      const a = (progress - 0.28) / 0.4;
      rig.rightArm.rotation.x = -1.85 + 2.95 * a;
      rig.torso.rotation.y = -0.45 + 0.95 * a;
    } else {
      // Recovery
      const r = (progress - 0.68) / 0.32;
      rig.rightArm.rotation.x = 1.1 * (1 - r);
      rig.torso.rotation.y = 0.5 * (1 - r);
    }
  } else {
    rig.rightArm.rotation.x =
      legSwing * 0.45 + Math.sin(elapsedTime * 2.4) * 0.06;
    rig.torso.rotation.y = isMoving ? Math.sin(stridePhase) * 0.14 : 0;
  }

  // Hit flash feedback
  const flashActive = hitFlashTimer > 0;
  for (let i = 0; i < rig.hitFlashMaterials.length; i++) {
    const m = rig.hitFlashMaterials[i];
    if (flashActive) {
      m.emissive.setHex(0xffffff);
      m.emissiveIntensity = 0.75;
    } else {
      m.emissive.setHex(0x000000);
      m.emissiveIntensity = 0;
    }
  }
}
