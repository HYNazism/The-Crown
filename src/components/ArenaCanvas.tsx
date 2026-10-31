import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ArticulatedActorRig,
  buildCharacterRig,
  getProceduralPatternTexture,
  updateCharacterRigAnimation,
} from '../game/characterBuilder';
import { Faction } from '../game/epochs';
import { soundEngine } from '../game/audio';
import {
  ArterialBloodDrop,
  BattlePhase,
  calculateAttackDamage,
  computeArterialSpray,
  computeFinisherDismemberment,
  DismemberedPart,
  EnemyBehaviorPolicy,
  GameSettings,
  resolveEpochRoles,
  stepBloodPhysics,
} from '../game/rules';

export interface LiveHUDTelemetry {
  playerHp: number;
  playerMaxHp: number;
  farrCharge: number;
  waveCleared: number;
  waveTotal: number;
  bossHp: number;
  bossMaxHp: number;
  phase: BattlePhase;
  comboCount?: number;
  cooldowns: {
    lasso: number;
    fire: number;
    dodge: number;
  };
  stats: {
    clearTimeSec: number;
    damageDealt: number;
    enemiesSlain: number;
  };
}

export interface VirtualControlState {
  moveX: number;
  moveZ: number;
  strikeQueued: boolean;
  lassoQueued: boolean;
  fireQueued: boolean;
  dodgeQueued: boolean;
}

interface ArenaCanvasProps {
  gameState: 'title' | 'playing' | 'paused' | 'gameover';
  epochId: number;
  faction: Faction;
  attackMultiplier: number;
  settings: GameSettings;
  battlePhase: BattlePhase;
  virtualInputRef: React.MutableRefObject<VirtualControlState>;
  onTelemetryUpdate: (telemetry: LiveHUDTelemetry) => void;
  onReachCrossroads: () => void;
  onBattleOutcome: (
    victory: boolean,
    stats: { clearTimeSec: number; damageDealt: number; enemiesSlain: number },
  ) => void;
}

interface EnemyEntity {
  id: number;
  rig: ArticulatedActorRig;
  policy: EnemyBehaviorPolicy;
  x: number;
  z: number;
  vx: number;
  vz: number;
  hp: number;
  maxHp: number;
  walkDist: number;
  attackTimer: number;
  attackDuration: number;
  windupTimer: number;
  hitFlashTimer: number;
  koTimer: number;
  telegraphRing: THREE.Mesh;
  armorColor: number;
}

const _vec3 = new THREE.Vector3();
const _dummy = new THREE.Object3D();

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({
  gameState,
  epochId,
  faction,
  attackMultiplier,
  settings,
  battlePhase,
  virtualInputRef,
  onTelemetryUpdate,
  onReachCrossroads,
  onBattleOutcome,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Store latest React props in ref so WebGL loop never tears down on UI updates
  const propsRef = useRef({
    gameState,
    epochId,
    faction,
    attackMultiplier,
    settings,
    battlePhase,
    onTelemetryUpdate,
    onReachCrossroads,
    onBattleOutcome,
  });

  useEffect(() => {
    propsRef.current = {
      gameState,
      epochId,
      faction,
      attackMultiplier,
      settings,
      battlePhase,
      onTelemetryUpdate,
      onReachCrossroads,
      onBattleOutcome,
    };
  }, [
    gameState,
    epochId,
    faction,
    attackMultiplier,
    settings,
    battlePhase,
    onTelemetryUpdate,
    onReachCrossroads,
    onBattleOutcome,
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL detection from GPU renderer string
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      45,
      (container.clientWidth || window.innerWidth) /
        (container.clientHeight || window.innerHeight),
      0.5,
      140,
    );
    camera.position.set(0, 14, 18);
    camera.lookAt(0, 1, 0);

    // 2. Studio 3-Point + Rim Warm/Cool Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xbfd9ff, 0x3b2614, 1.05);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.75);
    keyLight.position.set(14, 24, 12);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 60;
    const d = 18;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.35);
    rimLight.position.set(-12, 16, -15);
    scene.add(rimLight);

    const torchLight1 = new THREE.PointLight(0xf97316, 6.2, 22);
    torchLight1.position.set(-8, 3.4, -6);
    const torchLight2 = new THREE.PointLight(0xf97316, 6.2, 22);
    torchLight2.position.set(8, 3.4, -6);
    scene.add(torchLight1, torchLight2);

    // 3. Arena Ground, Persepolis Columns, Fire Braziers & Natural Rock Perimeter
    const arenaGroup = new THREE.Group();
    scene.add(arenaGroup);

    const floorTex = getProceduralPatternTexture('basalt');
    floorTex.repeat.set(14, 14);
    floorTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: floorTex,
      roughness: 0.72,
      metalness: 0.18,
    });
    const floorMesh = new THREE.Mesh(
      new THREE.CircleGeometry(32, 48),
      floorMat,
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    arenaGroup.add(floorMesh);

    // Golden inlay dueling ring on the basalt floor (offset y = 0.012 to prevent Z-fighting)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.28,
      metalness: 0.88,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const duelRing = new THREE.Mesh(
      new THREE.RingGeometry(11.4, 11.8, 48),
      ringMat,
    );
    duelRing.rotation.x = -Math.PI / 2;
    duelRing.position.y = 0.012;
    arenaGroup.add(duelRing);

    // Persepolis Fluted Columns & Fire Temple Braziers around the northern arc
    const colBaseGeo = new THREE.CylinderGeometry(0.75, 0.9, 0.6, 12);
    const colShaftGeo = new THREE.CylinderGeometry(0.52, 0.62, 6.2, 14);
    const colCapGeo = new THREE.BoxGeometry(1.55, 0.75, 0.9);
    const stoneColMat = new THREE.MeshStandardMaterial({
      color: 0x57534e,
      roughness: 0.68,
      metalness: 0.25,
    });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const flameCones: THREE.Mesh[] = [];

    for (let i = 0; i < 6; i++) {
      const angle = Math.PI + ((i - 2.5) / 5) * 2.1;
      const dist = 12.6;
      const cx = Math.cos(angle) * dist;
      const cz = Math.sin(angle) * dist;

      const colGroup = new THREE.Group();
      colGroup.position.set(cx, 0, cz);
      const base = new THREE.Mesh(colBaseGeo, stoneColMat);
      base.position.y = 0.3;
      const shaft = new THREE.Mesh(colShaftGeo, stoneColMat);
      shaft.position.y = 3.4;
      const cap = new THREE.Mesh(colCapGeo, ringMat);
      cap.position.y = 6.6;
      colGroup.add(base, shaft, cap);

      // Fire Brazier beside column
      if (i % 2 === 0) {
        const brazierBowl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.3, 1.2, 10),
          ringMat,
        );
        brazierBowl.position.set(0, 0.6, 1.4);
        const flameCone = new THREE.Mesh(
          new THREE.ConeGeometry(0.45, 1.15, 8),
          flameMat,
        );
        flameCone.position.set(0, 1.5, 1.4);
        flameCones.push(flameCone);
        colGroup.add(brazierBowl, flameCone);
      }

      arenaGroup.add(colGroup);
    }

    // Natural Jagged Mountain Crags around outer perimeter (InstancedMesh > 20 items)
    const cragCount = 28;
    const cragGeo = new THREE.DodecahedronGeometry(2.2, 0);
    const cragMat = new THREE.MeshStandardMaterial({
      color: 0x292524,
      roughness: 0.85,
      metalness: 0.12,
    });
    const cragInstanced = new THREE.InstancedMesh(cragGeo, cragMat, cragCount);
    for (let i = 0; i < cragCount; i++) {
      const angle = (i / cragCount) * Math.PI * 2;
      const r = 16.5 + (i % 3) * 2.2;
      _dummy.position.set(
        Math.cos(angle) * r,
        1.1 + (i % 4) * 0.45,
        Math.sin(angle) * r,
      );
      _dummy.rotation.set(i * 0.4, i * 0.8, 0);
      _dummy.scale.set(
        1 + (i % 3) * 0.35,
        1.4 + (i % 4) * 0.55,
        1 + (i % 2) * 0.3,
      );
      _dummy.updateMatrix();
      cragInstanced.setMatrixAt(i, _dummy.matrix);
    }
    cragInstanced.instanceMatrix.needsUpdate = true;
    cragInstanced.computeBoundingSphere();
    arenaGroup.add(cragInstanced);

    // Epoch-specific Landmark Group (Plane Tree in Epoch 11, Ring of Fire in Epoch 9, Damavand Lava in Epoch 6)
    const landmarkGroup = new THREE.Group();
    arenaGroup.add(landmarkGroup);

    // 4. Pooled Arterial Blood Particles & Floor Blood Pools (InstancedMesh)
    const maxBloodDrops = 160;
    const bloodDrops: ArterialBloodDrop[] = [];
    const bloodGeo = new THREE.CircleGeometry(0.28, 10);
    bloodGeo.rotateX(-Math.PI / 2);
    const bloodMat = new THREE.MeshStandardMaterial({
      color: 0x880808,
      roughness: 0.18,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const bloodInstanced = new THREE.InstancedMesh(
      bloodGeo,
      bloodMat,
      maxBloodDrops,
    );
    bloodInstanced.frustumCulled = false;
    for (let i = 0; i < maxBloodDrops; i++) {
      _dummy.position.set(0, -10, 0);
      _dummy.scale.setScalar(0.001);
      _dummy.updateMatrix();
      bloodInstanced.setMatrixAt(i, _dummy.matrix);
    }
    bloodInstanced.instanceMatrix.needsUpdate = true;
    scene.add(bloodInstanced);

    // Dismembered Parts Pool
    const dismemberedGroup = new THREE.Group();
    scene.add(dismemberedGroup);
    const activeDismembered: { part: DismemberedPart; mesh: THREE.Mesh }[] = [];

    // Active Actors Container
    const actorsGroup = new THREE.Group();
    scene.add(actorsGroup);

    // Skill Visual FX (Weapon Slash Crescent, Golden Lasso Ring & Sadeh Fire Wave)
    const slashArcGeo = new THREE.RingGeometry(1.1, 2.75, 24, 1, -Math.PI * 0.42, Math.PI * 0.84);
    slashArcGeo.rotateX(-Math.PI / 2);
    const slashArcMesh = new THREE.Mesh(
      slashArcGeo,
      new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      }),
    );
    slashArcMesh.position.y = 1.05;
    scene.add(slashArcMesh);

    const lassoFxMesh = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.08, 8, 28),
      new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0,
      }),
    );
    lassoFxMesh.rotation.x = Math.PI / 2;
    lassoFxMesh.position.y = 0.8;
    scene.add(lassoFxMesh);

    const fireFxMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 3.8, 32),
      new THREE.MeshBasicMaterial({
        color: 0xff5500,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      }),
    );
    fireFxMesh.rotation.x = -Math.PI / 2;
    fireFxMesh.position.y = 0.15;
    scene.add(fireFxMesh);

    // 5. Simulation State
    let currentBuiltEpochKey = '';
    let playerRig: ArticulatedActorRig | null = null;
    const playerState = {
      x: 0,
      z: 4,
      vx: 0,
      vz: 0,
      facingAngle: Math.PI,
      hp: 100,
      maxHp: 100,
      farr: 50,
      walkDist: 0,
      attackTimer: 0,
      attackDuration: 0.36,
      hitFlashTimer: 0,
      lassoCd: 0,
      fireCd: 0,
      dodgeCd: 0,
      slashFxTimer: 0,
      lassoFxTimer: 0,
      fireFxTimer: 0,
      comboCount: 0,
      comboTimer: 0,
    };

    let enemies: EnemyEntity[] = [];
    let nextEnemyId = 1;
    let waveCleared = 0;
    const waveTotal = 4;
    let bossSpawned = false;
    let outcomeTriggered = false;
    let runStats = {
      clearTimeSec: 0,
      damageDealt: 0,
      enemiesSlain: 0,
    };

    let hitstopTimer = 0;
    let cameraTrauma = 0;

    function clearEnemies() {
      for (const e of enemies) {
        actorsGroup.remove(e.rig.root);
        arenaGroup.remove(e.telegraphRing);
      }
      enemies = [];
    }

    function spawnEnemy(isBoss: boolean, index: number) {
      const { epochId: epId, faction: fac } = propsRef.current;
      const roles = resolveEpochRoles(epId, fac);
      const spec = isBoss ? roles.bossSpec : roles.vanguardSpecs[0];
      const rig = buildCharacterRig(spec);

      const angle = isBoss ? Math.PI : Math.PI + (index - 1) * 0.55;
      const dist = isBoss ? 6.5 : 7.5 + (index % 2) * 2.0;
      const sx = Math.sin(angle) * dist;
      const sz = Math.cos(angle) * dist;

      rig.root.position.set(sx, 0, sz);
      actorsGroup.add(rig.root);

      const policies: EnemyBehaviorPolicy[] = ['swarmer', 'charger', 'ranged'];
      const policy: EnemyBehaviorPolicy = isBoss
        ? 'boss_1v1'
        : policies[index % policies.length];

      const teleGeo = new THREE.RingGeometry(0.85, 1.15, 24);
      teleGeo.rotateX(-Math.PI / 2);
      const teleMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const telegraphRing = new THREE.Mesh(teleGeo, teleMat);
      telegraphRing.position.set(sx, 0.025, sz);
      arenaGroup.add(telegraphRing);

      const maxHp = isBoss ? 220 + epId * 18 : 55 + epId * 6;
      enemies.push({
        id: nextEnemyId++,
        rig,
        policy,
        x: sx,
        z: sz,
        vx: 0,
        vz: 0,
        hp: maxHp,
        maxHp,
        walkDist: 0,
        attackTimer: 0,
        attackDuration: isBoss ? 0.55 : 0.45,
        windupTimer: 0,
        hitFlashTimer: 0,
        koTimer: 0,
        telegraphRing,
        armorColor: spec.primaryColor,
      });
    }

    function rebuildEpochStage() {
      const { epochId: epId, faction: fac } = propsRef.current;
      const roles = resolveEpochRoles(epId, fac);
      const theme = roles.epoch.environmentTheme;

      scene.background = new THREE.Color(theme.skyColor);
      scene.fog = new THREE.FogExp2(theme.fogColor, 0.022);
      floorMat.color.setHex(theme.floorTint);
      torchLight1.color.setHex(theme.torchColor);
      torchLight2.color.setHex(theme.torchColor);
      flameMat.color.setHex(theme.torchColor);

      // Clear and rebuild epoch landmarks
      while (landmarkGroup.children.length > 0) {
        landmarkGroup.remove(landmarkGroup.children[0]);
      }

      if (theme.hasPlaneTree) {
        // Epoch 11: Ancient Hollow Plane Tree (درخت چنار کابل) & Spear Pit
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.85, 1.15, 4.8, 12),
          new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 }),
        );
        trunk.position.set(0, 2.4, -7.2);
        landmarkGroup.add(trunk);
      }
      if (theme.hasRingOfFire) {
        // Epoch 9: Siavash's Ring of Fire around the arena
        const fireRing = new THREE.Mesh(
          new THREE.TorusGeometry(9.8, 0.35, 8, 36),
          new THREE.MeshBasicMaterial({ color: 0xf97316 }),
        );
        fireRing.rotation.x = Math.PI / 2;
        fireRing.position.y = 0.35;
        landmarkGroup.add(fireRing);
      }

      // Rebuild Player Rig
      if (playerRig) {
        actorsGroup.remove(playerRig.root);
      }
      playerRig = buildCharacterRig(roles.playerSpec);
      playerState.x = 0;
      playerState.z = 4.2;
      playerState.facingAngle = Math.PI;
      playerState.hp = 100;
      playerState.maxHp = 100;
      playerState.farr = 50;
      playerState.lassoCd = 0;
      playerState.fireCd = 0;
      playerState.dodgeCd = 0;
      playerRig.root.position.set(playerState.x, 0, playerState.z);
      playerRig.root.rotation.y = playerState.facingAngle;
      actorsGroup.add(playerRig.root);

      // Reset Blood & Dismembered Parts
      bloodDrops.length = 0;
      for (let i = 0; i < maxBloodDrops; i++) {
        _dummy.position.set(0, -10, 0);
        _dummy.scale.setScalar(0.001);
        _dummy.updateMatrix();
        bloodInstanced.setMatrixAt(i, _dummy.matrix);
      }
      bloodInstanced.instanceMatrix.needsUpdate = true;

      while (dismemberedGroup.children.length > 0) {
        dismemberedGroup.remove(dismemberedGroup.children[0]);
      }
      activeDismembered.length = 0;

      // Spawn Vanguard Wave
      clearEnemies();
      waveCleared = 0;
      bossSpawned = false;
      outcomeTriggered = false;
      runStats = {
        clearTimeSec: 0,
        damageDealt: 0,
        enemiesSlain: 0,
      };
      for (let i = 0; i < 3; i++) {
        spawnEnemy(false, i);
      }
    }

    function addBloodAndGore(
      x: number,
      z: number,
      dirX: number,
      dirZ: number,
      isKill: boolean,
      armorColor: number,
    ) {
      const { settings: curSettings } = propsRef.current;
      const newDrops = computeArterialSpray(
        x,
        1.1,
        z,
        dirX,
        dirZ,
        curSettings.goreIntensity,
        isKill,
        Math.random(),
      );
      for (const drop of newDrops) {
        if (bloodDrops.length >= maxBloodDrops) {
          bloodDrops.shift();
        }
        bloodDrops.push(drop);
      }

      if (isKill) {
        const part = computeFinisherDismemberment(
          x,
          z,
          dirX,
          dirZ,
          curSettings.goreIntensity,
          armorColor,
        );
        if (part) {
          const partMesh = new THREE.Mesh(
            part.partType === 'head'
              ? new THREE.SphereGeometry(0.22, 10, 10)
              : new THREE.CylinderGeometry(0.09, 0.08, 0.55, 8),
            new THREE.MeshStandardMaterial({
              color: 0x991b1b,
              roughness: 0.4,
            }),
          );
          partMesh.position.set(part.x, part.y, part.z);
          dismemberedGroup.add(partMesh);
          activeDismembered.push({ part, mesh: partMesh });
        }
      }
    }

    // 6. Keyboard & Pointer Input Listeners
    const keysHeld = new Set<string>();
    const justPressed = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      if (!keysHeld.has(e.code)) {
        justPressed.add(e.code);
      }
      keysHeld.add(e.code);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysHeld.delete(e.code);
    };

    const onBlur = () => {
      keysHeld.clear();
      justPressed.clear();
    };

    const onPointerDown = (e: MouseEvent) => {
      if (e.button === 0 && propsRef.current.gameState === 'playing') {
        justPressed.add('MouseAttack');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    renderer.domElement.addEventListener('mousedown', onPointerDown);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Pre-build initial stage
    rebuildEpochStage();
    currentBuiltEpochKey = `${propsRef.current.epochId}-${propsRef.current.faction}`;
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 7. Main Simulation & Render Loop (with Software-WebGL afterDraw pacing)
    let frameId = 0;
    let lastTime = performance.now();
    let elapsedTime = 0;
    let lastHudSync = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function executePlayerStrike(
      range: number,
      baseDamage: number,
      isAreaSkill: boolean,
    ) {
      const { attackMultiplier: mult, settings: curSettings } =
        propsRef.current;
      const dmg = calculateAttackDamage(baseDamage, mult, curSettings.difficulty, true);
      let hitAny = false;

      for (const enemy of enemies) {
        if (enemy.koTimer > 0) continue;
        const dx = enemy.x - playerState.x;
        const dz = enemy.z - playerState.z;
        const dist = Math.hypot(dx, dz);

        if (dist <= range) {
          // Check directional cone unless area skill
          const dirX = Math.sin(playerState.facingAngle);
          const dirZ = Math.cos(playerState.facingAngle);
          const dot =
            dist > 0.01 ? (dx / dist) * dirX + (dz / dist) * dirZ : 1;

          if (isAreaSkill || dot > -0.15 || dist < 1.8) {
            hitAny = true;
            enemy.hp = Math.max(0, enemy.hp - dmg);
            enemy.hitFlashTimer = 0.12;
            runStats.damageDealt += dmg;
            playerState.comboCount += 1;
            playerState.comboTimer = 2.8;
            playerState.farr = Math.min(
              100,
              playerState.farr + 8 + Math.min(6, playerState.comboCount),
            );

            // Knockback impulse along weapon strike vector
            const kx = dist > 0.01 ? dx / dist : dirX;
            const kz = dist > 0.01 ? dz / dist : dirZ;
            enemy.vx += kx * (isAreaSkill ? 9 : 6.5);
            enemy.vz += kz * (isAreaSkill ? 9 : 6.5);

            const isKill = enemy.hp <= 0;
            addBloodAndGore(
              enemy.x,
              enemy.z,
              kx,
              kz,
              isKill,
              enemy.armorColor,
            );

            if (isKill) {
              enemy.koTimer = 0.45;
              runStats.enemiesSlain += 1;
              hitstopTimer = 0.065;
              cameraTrauma = Math.min(1, cameraTrauma + 0.55);
              soundEngine.playHitGore(curSettings, true);
            } else {
              hitstopTimer = 0.035;
              cameraTrauma = Math.min(1, cameraTrauma + 0.28);
              soundEngine.playHitGore(curSettings, false);
            }
          }
        }
      }

      if (!hitAny) {
        soundEngine.playStrike(curSettings, isAreaSkill);
      }
    }

    function tick() {
      const now = performance.now();
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.05);
      elapsedTime += dt;

      // Animate flickering Persepolis fire braziers & torch lights
      const flicker = 1 + Math.sin(elapsedTime * 11.5) * 0.12 + Math.cos(elapsedTime * 19.3) * 0.08;
      torchLight1.intensity = 6.0 * flicker;
      torchLight2.intensity = 6.0 * (2 - flicker);
      for (let i = 0; i < flameCones.length; i++) {
        const fc = flameCones[i];
        const s = 0.92 + Math.sin(elapsedTime * 13 + i * 2.1) * 0.16;
        fc.scale.set(1, s, 1);
      }

      const curProps = propsRef.current;
      const targetEpochKey = `${curProps.epochId}-${curProps.faction}`;
      if (targetEpochKey !== currentBuiltEpochKey) {
        currentBuiltEpochKey = targetEpochKey;
        rebuildEpochStage();
      }

      // Spawn 1v1 Boss when entering boss_duel phase
      if (curProps.battlePhase === 'boss_duel' && !bossSpawned) {
        clearEnemies();
        bossSpawned = true;
        spawnEnemy(true, 0);
        soundEngine.playWarHorn(curProps.settings, true);
      }

      // Title screen live world camera tour
      if (curProps.gameState === 'title') {
        const orbitAngle = elapsedTime * 0.22;
        camera.position.set(
          Math.sin(orbitAngle) * 14,
          9.5 + Math.sin(elapsedTime * 0.5) * 1.2,
          Math.cos(orbitAngle) * 14,
        );
        camera.lookAt(0, 1.4, 0);
        if (playerRig) {
          updateCharacterRigAnimation(
            playerRig,
            0,
            false,
            0,
            0.36,
            elapsedTime,
            0,
          );
        }
        for (let i = 0; i < enemies.length; i++) {
          updateCharacterRigAnimation(
            enemies[i].rig,
            0,
            false,
            0,
            0.45,
            elapsedTime + i * 0.9,
            0,
          );
        }
      } else if (
        curProps.gameState === 'playing' &&
        curProps.battlePhase !== 'crossroads'
      ) {
        runStats.clearTimeSec += dt;

        // Tick hitstop & trauma in real dt
        if (hitstopTimer > 0) {
          hitstopTimer = Math.max(0, hitstopTimer - dt);
        }
        cameraTrauma = Math.max(0, cameraTrauma - dt * 1.8);

        const simDt = hitstopTimer > 0 ? dt * 0.08 : dt;

        // Cooldowns & Combo decay
        playerState.lassoCd = Math.max(0, playerState.lassoCd - simDt);
        playerState.fireCd = Math.max(0, playerState.fireCd - simDt);
        playerState.dodgeCd = Math.max(0, playerState.dodgeCd - simDt);
        playerState.attackTimer = Math.max(0, playerState.attackTimer - simDt);
        playerState.hitFlashTimer = Math.max(
          0,
          playerState.hitFlashTimer - dt,
        );
        playerState.slashFxTimer = Math.max(0, playerState.slashFxTimer - dt);
        playerState.lassoFxTimer = Math.max(0, playerState.lassoFxTimer - dt);
        playerState.fireFxTimer = Math.max(0, playerState.fireFxTimer - dt);
        if (playerState.comboTimer > 0) {
          playerState.comboTimer = Math.max(0, playerState.comboTimer - simDt);
          if (playerState.comboTimer === 0) {
            playerState.comboCount = 0;
          }
        }

        slashArcMesh.position.set(playerState.x, 1.05, playerState.z);
        slashArcMesh.rotation.y = playerState.facingAngle - Math.PI / 2;
        (slashArcMesh.material as THREE.MeshBasicMaterial).opacity =
          playerState.slashFxTimer * 3.8;
        slashArcMesh.scale.setScalar(1 + (0.22 - playerState.slashFxTimer) * 1.2);

        lassoFxMesh.position.set(playerState.x, 0.8, playerState.z);
        (lassoFxMesh.material as THREE.MeshBasicMaterial).opacity =
          playerState.lassoFxTimer * 2.5;
        lassoFxMesh.scale.setScalar(1 + (0.35 - playerState.lassoFxTimer) * 1.5);

        fireFxMesh.position.set(playerState.x, 0.15, playerState.z);
        (fireFxMesh.material as THREE.MeshBasicMaterial).opacity =
          playerState.fireFxTimer * 2.2;
        fireFxMesh.scale.setScalar(1 + (0.4 - playerState.fireFxTimer) * 1.8);

        // Read Input (Keyboard + Touch Virtual Joystick)
        let moveX = virtualInputRef.current.moveX;
        let moveZ = virtualInputRef.current.moveZ;
        if (keysHeld.has('KeyA') || keysHeld.has('ArrowLeft')) moveX -= 1;
        if (keysHeld.has('KeyD') || keysHeld.has('ArrowRight')) moveX += 1;
        if (keysHeld.has('KeyW') || keysHeld.has('ArrowUp')) moveZ -= 1;
        if (keysHeld.has('KeyS') || keysHeld.has('ArrowDown')) moveZ += 1;

        const moveLen = Math.hypot(moveX, moveZ);
        const isMoving = moveLen > 0.05;
        if (isMoving) {
          const nx = moveX / moveLen;
          const nz = moveZ / moveLen;
          const speed = 7.4;
          playerState.x += nx * speed * simDt;
          playerState.z += nz * speed * simDt;
          playerState.walkDist += speed * simDt;
          playerState.facingAngle = Math.atan2(nx, nz);
        }

        // Clamp player to circular Persepolis arena
        const pRadius = Math.hypot(playerState.x, playerState.z);
        if (pRadius > 10.8) {
          playerState.x = (playerState.x / pRadius) * 10.8;
          playerState.z = (playerState.z / pRadius) * 10.8;
        }

        // Edge-triggered Combat Actions
        const wantStrike =
          justPressed.has('Space') ||
          justPressed.has('KeyJ') ||
          justPressed.has('MouseAttack') ||
          virtualInputRef.current.strikeQueued;
        const wantLasso =
          justPressed.has('Digit1') ||
          justPressed.has('KeyK') ||
          virtualInputRef.current.lassoQueued;
        const wantFire =
          justPressed.has('Digit2') ||
          justPressed.has('KeyL') ||
          virtualInputRef.current.fireQueued;
        const wantDodge =
          justPressed.has('Digit3') ||
          justPressed.has('ShiftLeft') ||
          virtualInputRef.current.dodgeQueued;

        virtualInputRef.current.strikeQueued = false;
        virtualInputRef.current.lassoQueued = false;
        virtualInputRef.current.fireQueued = false;
        virtualInputRef.current.dodgeQueued = false;
        justPressed.clear();

        if (wantStrike && playerState.attackTimer <= 0.04) {
          playerState.attackTimer = playerState.attackDuration;
          playerState.slashFxTimer = 0.22;
          executePlayerStrike(3.4, 28, false);
        }

        if (wantLasso && playerState.lassoCd <= 0) {
          playerState.lassoCd = 4.5;
          playerState.lassoFxTimer = 0.35;
          playerState.attackTimer = playerState.attackDuration;
          soundEngine.playSkill(curProps.settings, 'lasso');
          // Pull nearby enemies inward & stun
          for (const e of enemies) {
            if (e.koTimer > 0) continue;
            const dx = playerState.x - e.x;
            const dz = playerState.z - e.z;
            const dist = Math.hypot(dx, dz);
            if (dist < 6.5 && dist > 1.2) {
              e.x += dx * 0.48;
              e.z += dz * 0.48;
              e.windupTimer = 0;
            }
          }
          executePlayerStrike(5.8, 36, true);
        }

        if (wantFire && playerState.fireCd <= 0) {
          playerState.fireCd = 6.0;
          playerState.fireFxTimer = 0.4;
          playerState.attackTimer = playerState.attackDuration;
          soundEngine.playSkill(curProps.settings, 'fire');
          executePlayerStrike(4.8, 52, true);
        }

        if (wantDodge && playerState.dodgeCd <= 0) {
          playerState.dodgeCd = 2.2;
          soundEngine.playSkill(curProps.settings, 'dodge');
          const dashDirX = Math.sin(playerState.facingAngle);
          const dashDirZ = Math.cos(playerState.facingAngle);
          playerState.x += dashDirX * 3.2;
          playerState.z += dashDirZ * 3.2;
        }

        if (playerRig) {
          playerRig.root.position.set(playerState.x, 0, playerState.z);
          playerRig.root.rotation.y = playerState.facingAngle;
          updateCharacterRigAnimation(
            playerRig,
            playerState.walkDist,
            isMoving,
            playerState.attackTimer,
            playerState.attackDuration,
            elapsedTime,
            playerState.hitFlashTimer,
          );
        }

        // Step Enemies & Crowd Attack Token Pool (max 2 concurrent windups)
        let activeAttackers = enemies.filter((e) => e.windupTimer > 0).length;

        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          e.hitFlashTimer = Math.max(0, e.hitFlashTimer - dt);

          if (e.koTimer > 0) {
            e.koTimer -= dt;
            e.rig.root.rotation.x = (0.45 - e.koTimer) * 3.2;
            e.rig.root.position.y = Math.max(-0.4, -0.8 * (0.45 - e.koTimer));
            (e.telegraphRing.material as THREE.MeshBasicMaterial).opacity = 0;
            if (e.koTimer <= 0) {
              actorsGroup.remove(e.rig.root);
              arenaGroup.remove(e.telegraphRing);
              enemies.splice(i, 1);

              if (curProps.battlePhase === 'vanguard') {
                waveCleared += 1;
                if (waveCleared < waveTotal && enemies.length < 2) {
                  spawnEnemy(false, waveCleared + 2);
                } else if (waveCleared >= waveTotal && enemies.length === 0) {
                  curProps.onReachCrossroads();
                }
              } else if (
                curProps.battlePhase === 'boss_duel' &&
                enemies.length === 0 &&
                !outcomeTriggered
              ) {
                outcomeTriggered = true;
                soundEngine.playWarHorn(curProps.settings, true);
                curProps.onBattleOutcome(true, { ...runStats });
              }
            }
            continue;
          }

          // Knockback velocity decay
          e.x += e.vx * simDt;
          e.z += e.vz * simDt;
          e.vx *= Math.exp(-8 * simDt);
          e.vz *= Math.exp(-8 * simDt);

          const dx = playerState.x - e.x;
          const dz = playerState.z - e.z;
          const dist = Math.hypot(dx, dz) || 0.001;
          const nx = dx / dist;
          const nz = dz / dist;
          const angleToPlayer = Math.atan2(nx, nz);
          e.rig.root.rotation.y = angleToPlayer;

          const attackRange =
            e.policy === 'ranged' ? 5.2 : e.policy === 'boss_1v1' ? 2.8 : 2.1;
          const moveSpeed =
            e.policy === 'charger'
              ? 4.6
              : e.policy === 'boss_1v1'
              ? 4.1
              : e.policy === 'ranged'
              ? 2.8
              : 3.5;

          let enemyMoving = false;
          if (e.windupTimer > 0) {
            e.windupTimer -= simDt;
            (e.telegraphRing.material as THREE.MeshBasicMaterial).opacity =
              0.65;
            if (e.windupTimer <= 0) {
              e.attackTimer = e.attackDuration;
              (e.telegraphRing.material as THREE.MeshBasicMaterial).opacity = 0;
              if (dist <= attackRange + 0.7) {
                const rawEnemyDmg = e.policy === 'boss_1v1' ? 16 : 9;
                const dmg = calculateAttackDamage(
                  rawEnemyDmg,
                  1,
                  curProps.settings.difficulty,
                  false,
                );
                playerState.hp = Math.max(0, playerState.hp - dmg);
                playerState.hitFlashTimer = 0.14;
                playerState.comboCount = 0;
                cameraTrauma = Math.min(1, cameraTrauma + 0.35);
                addBloodAndGore(
                  playerState.x,
                  playerState.z,
                  nx,
                  nz,
                  false,
                  0x991b1b,
                );
                soundEngine.playHitGore(curProps.settings, false);

                if (playerState.hp <= 0 && !outcomeTriggered) {
                  outcomeTriggered = true;
                  soundEngine.playWarHorn(curProps.settings, false);
                  curProps.onBattleOutcome(false, { ...runStats });
                }
              }
            }
          } else if (e.attackTimer > 0) {
            e.attackTimer -= simDt;
          } else {
            // Distinct Enemy Movement Policies
            if (e.policy === 'ranged' && dist < 3.4) {
              // Kite away from player
              e.x -= nx * moveSpeed * 0.75 * simDt;
              e.z -= nz * moveSpeed * 0.75 * simDt;
              enemyMoving = true;
            } else if (dist > attackRange * 0.88) {
              // Advance toward player (with slight flank offset for chargers)
              const flank = e.policy === 'charger' ? 0.3 : 0;
              e.x += (nx - nz * flank) * moveSpeed * simDt;
              e.z += (nz + nx * flank) * moveSpeed * simDt;
              e.walkDist += moveSpeed * simDt;
              enemyMoving = true;
            } else if (activeAttackers < 2) {
              // Enter visible windup telegraph before striking
              e.windupTimer = e.policy === 'boss_1v1' ? 0.42 : 0.52;
              activeAttackers += 1;
            }
          }

          // Keep enemy within arena radius
          const eRad = Math.hypot(e.x, e.z);
          if (eRad > 11.2) {
            e.x = (e.x / eRad) * 11.2;
            e.z = (e.z / eRad) * 11.2;
          }

          e.rig.root.position.set(e.x, 0, e.z);
          e.telegraphRing.position.set(e.x, 0.025, e.z);
          updateCharacterRigAnimation(
            e.rig,
            e.walkDist,
            enemyMoving,
            e.attackTimer,
            e.attackDuration,
            elapsedTime,
            e.hitFlashTimer,
          );
        }

        // Step Blood & Dismemberment Physics
        stepBloodPhysics(bloodDrops, simDt);
        for (let i = 0; i < maxBloodDrops; i++) {
          const d = bloodDrops[i];
          if (d) {
            _dummy.position.set(d.x, d.y, d.z);
            _dummy.scale.setScalar(d.settled ? d.size * 2.1 : d.size);
          } else {
            _dummy.position.set(0, -10, 0);
            _dummy.scale.setScalar(0.001);
          }
          _dummy.updateMatrix();
          bloodInstanced.setMatrixAt(i, _dummy.matrix);
        }
        bloodInstanced.instanceMatrix.needsUpdate = true;

        for (const item of activeDismembered) {
          if (item.part.y > 0.14) {
            item.part.x += item.part.vx * simDt;
            item.part.y += item.part.vy * simDt;
            item.part.z += item.part.vz * simDt;
            item.part.vy -= 18.5 * simDt;
            item.mesh.position.set(item.part.x, item.part.y, item.part.z);
            item.mesh.rotation.x += 6 * simDt;
            item.mesh.rotation.z += 5 * simDt;
          }
        }

        // Smooth Exponential Damped Camera (Supports both 3D Isometric & 2D Miniature Side-View)
        const is2D = curProps.settings.cameraMode === '2d';
        const shakeAmt = curProps.settings.cameraShake
          ? cameraTrauma * cameraTrauma * 0.48
          : 0;
        const shakeX = (Math.random() - 0.5) * shakeAmt;
        const shakeY = (Math.random() - 0.5) * shakeAmt;

        const targetCamX =
          playerState.x * (is2D ? 0.85 : 0.55) + shakeX;
        const targetCamY = (is2D ? 3.4 : 13.5) + shakeY;
        const targetCamZ = playerState.z * (is2D ? 0.3 : 0.55) + (is2D ? 16.5 : 14.2);

        const dampFactor = 1 - Math.exp(-6.5 * dt);
        camera.position.lerp(
          _vec3.set(targetCamX, targetCamY, targetCamZ),
          dampFactor,
        );
        camera.lookAt(
          playerState.x * 0.45,
          is2D ? 1.5 : 0.8,
          playerState.z * 0.35,
        );

        // Throttle React HUD updates to ~10Hz
        if (now - lastHudSync > 95) {
          lastHudSync = now;
          const bossEntity = enemies.find((e) => e.policy === 'boss_1v1');
          curProps.onTelemetryUpdate({
            playerHp: playerState.hp,
            playerMaxHp: playerState.maxHp,
            farrCharge: playerState.farr,
            waveCleared: Math.min(waveCleared, waveTotal),
            waveTotal,
            bossHp: bossEntity ? bossEntity.hp : 0,
            bossMaxHp: bossEntity ? bossEntity.maxHp : 250,
            phase: curProps.battlePhase,
            comboCount: playerState.comboCount,
            cooldowns: {
              lasso: playerState.lassoCd,
              fire: playerState.fireCd,
              dodge: playerState.dodgeCd,
            },
            stats: { ...runStats },
          });
        }
      }

      renderer.render(scene, camera);
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousedown', onPointerDown);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [virtualInputRef]);

  return (
    <div
      ref={mountRef}
      data-testid="arena-canvas"
      className="fixed inset-0 w-full h-full overflow-hidden bg-stone-950"
    />
  );
};
