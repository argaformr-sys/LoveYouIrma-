/* =========================================================
   KONFIGURASI NOMOR WHATSAPP PEMBUAT WEBSITE
   Ganti dengan nomor WhatsApp kamu (format kode negara tanpa +, spasi, atau -)
   Contoh Indonesia: '6281234567890'
   ========================================================= */
const WHATSAPP_NUMBER = '6289518929290';
const WHATSAPP_MESSAGE = 'IYA AKU MENCINTAIMU 🩷';

(function () {
  'use strict';

  // DOM Elements
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIconSymbol = document.getElementById('music-icon-symbol');
  const volumeSlider = document.getElementById('volume-slider');

  const stageLoading = document.getElementById('stage-loading');
  const loadingBarFill = document.getElementById('loading-bar-fill');
  const stageGift = document.getElementById('stage-gift');
  const openGiftBtn = document.getElementById('open-gift-btn');
  const giftTapZone = document.getElementById('gift-tap-zone');
  const stageMain = document.getElementById('stage-main');

  const loveEnvelope = document.getElementById('love-envelope');
  const letterSection = document.getElementById('letter-section');
  const gallerySection = document.getElementById('gallery-section');
  const whatsappSection = document.getElementById('whatsapp-section');

  const mascotBubble = document.getElementById('mascot-bubble');
  const mascotBubbleText = document.getElementById('mascot-bubble-text');

  // App State
  let currentStage = 'loading'; // 'loading' | 'gift' | 'garden' | 'letter' | 'gallery'
  let giftOpened = false;
  let envelopeOpened = false;
  let teddyJumpTimer = 0;
  let teddyHeartBurstTimer = 0;

  /* =========================================================
     1. AUTOMATIC ROMANTIC MUSIC & CONTROLS
     ========================================================= */
  bgMusic.volume = parseFloat(volumeSlider.value);

  function updateMusicUI(isPlaying) {
    if (isPlaying) {
      musicToggleBtn.classList.add('playing');
      musicIconSymbol.textContent = '🎵';
    } else {
      musicToggleBtn.classList.remove('playing');
      musicIconSymbol.textContent = '🔇';
    }
  }

  function tryAutoPlayMusic() {
    if (!bgMusic.paused) {
      updateMusicUI(true);
      return;
    }
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateMusicUI(true);
        })
        .catch(() => {
          updateMusicUI(false);
        });
    }
  }

  // Attempt immediate autoplay + unlock on first touch/click anywhere
  tryAutoPlayMusic();
  ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
    window.addEventListener(
      evt,
      function unlockAudio() {
        if (bgMusic.paused) {
          tryAutoPlayMusic();
        }
      },
      { passive: true }
    );
  });

  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play().then(() => updateMusicUI(true)).catch(() => {});
    } else {
      bgMusic.pause();
      updateMusicUI(false);
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = parseFloat(e.target.value);
  });

  /* =========================================================
     2. 2D AMBIENT FALLING HEARTS, GLITTER & MULTI-TAP RAIN
     ========================================================= */
  const ambientCanvas = document.getElementById('ambient-canvas');
  const ctx2d = ambientCanvas.getContext('2d');
  let particles2D = [];

  function resizeAmbient() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  resizeAmbient();
  window.addEventListener('resize', resizeAmbient);

  function spawnParticle2D(x, y, burst) {
    const isHeart = Math.random() < (burst ? 0.85 : 0.55);
    particles2D.push({
      x: x !== undefined ? x : Math.random() * ambientCanvas.width,
      y: y !== undefined ? y : -20,
      vx: burst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 1.1,
      vy: burst ? (Math.random() - 0.8) * 6 : 1 + Math.random() * 1.8,
      size: isHeart ? 10 + Math.random() * 10 : 2.5 + Math.random() * 3.5,
      alpha: 0.85 + Math.random() * 0.15,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.06,
      isHeart,
      color: ['#ff4d8d', '#ff85b3', '#ffc2d9', '#ffffff', '#ffd166'][
        Math.floor(Math.random() * 5)
      ]
    });
  }

  for (let i = 0; i < 28; i++) {
    spawnParticle2D(
      Math.random() * ambientCanvas.width,
      Math.random() * ambientCanvas.height,
      false
    );
  }

  function drawHeart2D(ctx, x, y, size, rot, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const s = size * 0.5;
    ctx.moveTo(0, s * 0.4);
    ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.8, s * 0.3, 0, s * 1.5);
    ctx.bezierCurveTo(s * 1.8, s * 0.3, s, -s * 0.6, 0, s * 0.4);
    ctx.fill();
    ctx.restore();
  }

  function animateAmbient2D() {
    ctx2d.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

    if (particles2D.length < 45 && Math.random() < 0.25) {
      spawnParticle2D();
    }

    for (let i = particles2D.length - 1; i >= 0; i--) {
      const p = particles2D[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      if (p.vy < 2.2) p.vy += 0.03;

      if (p.isHeart) {
        drawHeart2D(ctx2d, p.x, p.y, p.size, p.rotation, p.color, p.alpha);
      } else {
        ctx2d.save();
        ctx2d.globalAlpha = p.alpha;
        ctx2d.fillStyle = p.color;
        ctx2d.beginPath();
        ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.restore();
      }

      if (p.y > ambientCanvas.height + 30) {
        particles2D.splice(i, 1);
      }
    }
    requestAnimationFrame(animateAmbient2D);
  }
  animateAmbient2D();

  // Multi-tap screen triggers Heart Rain
  let tapTimes = [];
  window.addEventListener(
    'pointerdown',
    (e) => {
      const now = Date.now();
      tapTimes.push(now);
      tapTimes = tapTimes.filter((t) => now - t < 1200);

      for (let i = 0; i < 6; i++) {
        spawnParticle2D(e.clientX, e.clientY, true);
      }

      if (tapTimes.length >= 3) {
        for (let i = 0; i < 28; i++) {
          spawnParticle2D(
            Math.random() * ambientCanvas.width,
            Math.random() * (ambientCanvas.height * 0.4),
            true
          );
        }
        showMascotSpeech('Hujan cinta buat Irma! 💗✨');
        tapTimes = [];
      }
    },
    { passive: true }
  );

  /* =========================================================
     3. THREE.JS 3D PINK TEDDY BEAR & 3D GLOSSY GIFT BOX
     ========================================================= */
  const threeCanvas = document.getElementById('three-canvas');
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.3, 6.2);

  const renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xfff0f6, 1.1);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
  dirLight.position.set(3.5, 6.5, 5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const pinkRimLight = new THREE.PointLight(0xff5c97, 1.4, 14);
  pinkRimLight.position.set(-2.5, 2.5, 3);
  scene.add(pinkRimLight);

  // Soft Shadow Catcher Ground
  const groundGeo = new THREE.PlaneGeometry(14, 14);
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.14 });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -1.35;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  /* --- Build 3D Cute Pink Teddy Bear --- */
  const teddyGroup = new THREE.Group();
  scene.add(teddyGroup);

  const furPinkMat = new THREE.MeshStandardMaterial({
    color: 0xff8fb8,
    roughness: 0.55,
    metalness: 0.05
  });
  const snoutCreamMat = new THREE.MeshStandardMaterial({
    color: 0xfff3eb,
    roughness: 0.5
  });
  const ribbonPinkMat = new THREE.MeshPhysicalMaterial({
    color: 0xff2e7a,
    roughness: 0.25,
    clearcoat: 0.8
  });
  const eyeDarkMat = new THREE.MeshStandardMaterial({
    color: 0x24111b,
    roughness: 0.15
  });
  const eyeShineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const blushMat = new THREE.MeshBasicMaterial({
    color: 0xff477e,
    transparent: true,
    opacity: 0.65
  });

  // Body
  const bodyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.68, 28, 28),
    furPinkMat
  );
  bodyMesh.scale.set(1, 1.12, 0.92);
  bodyMesh.position.y = -0.35;
  bodyMesh.castShadow = true;
  teddyGroup.add(bodyMesh);

  // Belly patch
  const bellyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.44, 24, 24),
    snoutCreamMat
  );
  bellyMesh.position.set(0, -0.35, 0.42);
  teddyGroup.add(bellyMesh);

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.65, 0);
  teddyGroup.add(headGroup);

  const headMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 32, 32),
    furPinkMat
  );
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.22, 20, 20);
  const innerEarGeo = new THREE.SphereGeometry(0.13, 16, 16);
  [-0.46, 0.46].forEach((ex) => {
    const ear = new THREE.Mesh(earGeo, furPinkMat);
    ear.position.set(ex, 0.48, -0.05);
    headGroup.add(ear);

    const innerEar = new THREE.Mesh(innerEarGeo, snoutCreamMat);
    innerEar.position.set(ex, 0.48, 0.08);
    headGroup.add(innerEar);
  });

  // Snout & Nose
  const snout = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 24, 24),
    snoutCreamMat
  );
  snout.scale.set(1.18, 0.9, 0.85);
  snout.position.set(0, -0.1, 0.52);
  headGroup.add(snout);

  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    ribbonPinkMat
  );
  nose.position.set(0, -0.02, 0.72);
  headGroup.add(nose);

  // Cute Round Eyes (with blink scale)
  const leftEyeGroup = new THREE.Group();
  leftEyeGroup.position.set(-0.22, 0.1, 0.54);
  const rightEyeGroup = new THREE.Group();
  rightEyeGroup.position.set(0.22, 0.1, 0.54);

  [leftEyeGroup, rightEyeGroup].forEach((eg) => {
    const eyeBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 16, 16),
      eyeDarkMat
    );
    const shine = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12),
      eyeShineMat
    );
    shine.position.set(0.028, 0.03, 0.072);
    eg.add(eyeBall, shine);
    headGroup.add(eg);
  });

  // Rosy Cheeks
  [-0.36, 0.36].forEach((cx) => {
    const cheek = new THREE.Mesh(
      new THREE.SphereGeometry(0.095, 16, 16),
      blushMat
    );
    cheek.scale.set(1.2, 0.75, 0.4);
    cheek.position.set(cx, -0.08, 0.52);
    headGroup.add(cheek);
  });

  // Pink Bowtie / Ribbon
  const bowCenter = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    ribbonPinkMat
  );
  bowCenter.position.set(0, 0.12, 0.56);
  teddyGroup.add(bowCenter);

  [-0.16, 0.16].forEach((bx, idx) => {
    const wing = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.24, 16),
      ribbonPinkMat
    );
    wing.position.set(bx, 0.12, 0.54);
    wing.rotation.z = idx === 0 ? -Math.PI / 2 : Math.PI / 2;
    teddyGroup.add(wing);
  });

  // Arms
  const armGeo = new THREE.SphereGeometry(0.22, 20, 20);
  armGeo.scale(0.85, 1.55, 0.85);

  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.62, -0.1, 0.05);
  const leftArmMesh = new THREE.Mesh(armGeo, furPinkMat);
  leftArmMesh.position.set(-0.08, -0.22, 0);
  leftArmPivot.add(leftArmMesh);
  teddyGroup.add(leftArmPivot);

  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.62, -0.1, 0.05);
  const rightArmMesh = new THREE.Mesh(armGeo, furPinkMat);
  rightArmMesh.position.set(0.08, -0.22, 0);
  rightArmPivot.add(rightArmMesh);
  teddyGroup.add(rightArmPivot);

  // Flower held by Teddy during Letter reading
  const teddyFlowerGroup = new THREE.Group();
  teddyFlowerGroup.position.set(0.15, -0.45, 0.28);
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.55, 10),
    new THREE.MeshStandardMaterial({ color: 0x4caf50 })
  );
  stem.position.y = 0.22;
  teddyFlowerGroup.add(stem);
  const flowerHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xff4d8d })
  );
  flowerHead.position.y = 0.5;
  teddyFlowerGroup.add(flowerHead);
  teddyFlowerGroup.visible = false;
  rightArmPivot.add(teddyFlowerGroup);

  // Legs
  const legGeo = new THREE.SphereGeometry(0.25, 20, 20);
  legGeo.scale(0.95, 0.8, 1.35);
  const leftLeg = new THREE.Mesh(legGeo, furPinkMat);
  leftLeg.position.set(-0.34, -1.05, 0.22);
  const rightLeg = new THREE.Mesh(legGeo, furPinkMat);
  rightLeg.position.set(0.34, -1.05, 0.22);
  teddyGroup.add(leftLeg, rightLeg);

  /* --- Build 3D Glossy Pink Gift Box --- */
  const giftGroup = new THREE.Group();
  giftGroup.visible = false;
  scene.add(giftGroup);

  const boxPinkMat = new THREE.MeshPhysicalMaterial({
    color: 0xffb3d1,
    roughness: 0.16,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  const boxRibbonMat = new THREE.MeshPhysicalMaterial({
    color: 0xff3b82,
    roughness: 0.22,
    metalness: 0.15,
    clearcoat: 0.9
  });

  const boxBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 1.35, 1.75),
    boxPinkMat
  );
  boxBase.position.y = -0.55;
  boxBase.castShadow = true;
  boxBase.receiveShadow = true;
  giftGroup.add(boxBase);

  // Cross Ribbons on Base
  const rib1 = new THREE.Mesh(
    new THREE.BoxGeometry(1.79, 1.36, 0.28),
    boxRibbonMat
  );
  rib1.position.y = -0.55;
  const rib2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 1.36, 1.79),
    boxRibbonMat
  );
  rib2.position.y = -0.55;
  giftGroup.add(rib1, rib2);

  // Gift Box Lid Pivot (for 3D opening animation)
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.15, -0.92);
  giftGroup.add(lidPivot);

  const lidMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.34, 1.9),
    boxPinkMat
  );
  lidMesh.position.set(0, 0.14, 0.92);
  lidMesh.castShadow = true;
  lidPivot.add(lidMesh);

  const lidRib1 = new THREE.Mesh(
    new THREE.BoxGeometry(1.94, 0.36, 0.3),
    boxRibbonMat
  );
  lidRib1.position.set(0, 0.14, 0.92);
  const lidRib2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.36, 1.94),
    boxRibbonMat
  );
  lidRib2.position.set(0, 0.14, 0.92);
  lidPivot.add(lidRib1, lidRib2);

  // Top Bow Loops
  [-0.28, 0.28].forEach((bx, i) => {
    const loop = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.07, 14, 28),
      boxRibbonMat
    );
    loop.position.set(bx, 0.44, 0.92);
    loop.rotation.y = i === 0 ? 0.35 : -0.35;
    lidPivot.add(loop);
  });

  // Pink Light inside Gift Box
  const giftInnerLight = new THREE.PointLight(0xff4d8d, 0, 8);
  giftInnerLight.position.set(0, 0.1, 0);
  giftGroup.add(giftInnerLight);

  /* =========================================================
     4. STAGE FLOW & INTERACTIONS
     ========================================================= */
  function showMascotSpeech(text, duration = 3400) {
    mascotBubbleText.textContent = text;
    mascotBubble.classList.remove('hidden');
    clearTimeout(showMascotSpeech._timer);
    showMascotSpeech._timer = setTimeout(() => {
      mascotBubble.classList.add('hidden');
    }, duration);
  }

  // Loading Progress Sequence
  let loadPct = 0;
  const loadInterval = setInterval(() => {
    loadPct += 4;
    loadingBarFill.style.width = Math.min(loadPct, 100) + '%';
    if (loadPct >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        currentStage = 'gift';
        stageLoading.classList.remove('active');
        stageLoading.classList.add('hidden');
        stageGift.classList.remove('hidden');
        stageGift.classList.add('active');
        giftGroup.visible = true;
        threeCanvas.classList.add('interactive-3d');
        showMascotSpeech('Ada hadiah spesial buat kamu! 🎁');
      }, 450);
    }
  }, 85);

  // Open 3D Gift Box
  function triggerOpenGift() {
    if (giftOpened) return;
    giftOpened = true;
    tryAutoPlayMusic();
    teddyJumpTimer = 1.6;
    showMascotSpeech('Yeayy!! Buka suratnya ya Sayang! 💌');

    // Burst hearts & petals
    for (let i = 0; i < 45; i++) {
      spawnParticle2D(
        window.innerWidth * 0.5 + (Math.random() - 0.5) * 140,
        window.innerHeight * 0.48,
        true
      );
    }

    setTimeout(() => {
      currentStage = 'garden';
      stageGift.classList.remove('active');
      stageGift.classList.add('hidden');
      giftGroup.visible = false;
      threeCanvas.classList.remove('interactive-3d');

      stageMain.classList.remove('hidden');
      buildFlowerGarden2D();
      buildButterflies2D();
    }, 1500);
  }

  openGiftBtn.addEventListener('click', triggerOpenGift);
  giftTapZone.addEventListener('click', triggerOpenGift);
  threeCanvas.addEventListener('click', () => {
    if (currentStage === 'gift') triggerOpenGift();
  });

  // Build 2D Blooming Flowers
  function buildFlowerGarden2D() {
    const container = document.getElementById('flower-garden-2d');
    container.innerHTML = '';
    const count = window.innerWidth < 520 ? 9 : 16;
    for (let i = 0; i < count; i++) {
      const isPink = i % 2 === 0;
      const petalColor = isPink ? '#ff7eb3' : '#ffffff';
      const centerColor = isPink ? '#ffd166' : '#ff5c97';
      const h = 75 + (i % 4) * 22;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 60 120');
      svg.setAttribute('width', '46');
      svg.setAttribute('height', String(h));
      svg.classList.add('bloom-flower');
      svg.style.animationDelay = `${i * 0.08}s`;
      svg.innerHTML = `
        <path d="M30 120 Q28 75 30 42" stroke="#69b578" stroke-width="4" fill="none" stroke-linecap="round"/>
        <ellipse cx="22" cy="84" rx="9" ry="5" transform="rotate(-25 22 84)" fill="#7bc98a"/>
        <ellipse cx="38" cy="72" rx="9" ry="5" transform="rotate(25 38 72)" fill="#7bc98a"/>
        <circle cx="30" cy="26" r="10" fill="${petalColor}" stroke="#ffb3d1" stroke-width="1.5"/>
        <circle cx="19" cy="36" r="10" fill="${petalColor}" stroke="#ffb3d1" stroke-width="1.5"/>
        <circle cx="41" cy="36" r="10" fill="${petalColor}" stroke="#ffb3d1" stroke-width="1.5"/>
        <circle cx="23" cy="48" r="10" fill="${petalColor}" stroke="#ffb3d1" stroke-width="1.5"/>
        <circle cx="37" cy="48" r="10" fill="${petalColor}" stroke="#ffb3d1" stroke-width="1.5"/>
        <circle cx="30" cy="38" r="7" fill="${centerColor}"/>
      `;
      container.appendChild(svg);
    }
  }

  // Build 2D Flying Butterflies
  function buildButterflies2D() {
    const layer = document.getElementById('butterfly-layer');
    layer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const bf = document.createElement('div');
      bf.className = 'butterfly-2d';
      bf.style.left = `${10 + i * 15}%`;
      bf.style.top = `${18 + (i % 3) * 20}%`;
      bf.style.animationDelay = `${i * 1.3}s`;
      bf.innerHTML = `
        <svg viewBox="0 0 40 40" width="28" height="28">
          <ellipse cx="13" cy="15" rx="9" ry="6" transform="rotate(-25 13 15)" fill="#ff85b3" opacity="0.88"/>
          <ellipse cx="27" cy="15" rx="9" ry="6" transform="rotate(25 27 15)" fill="#ff85b3" opacity="0.88"/>
          <ellipse cx="14" cy="25" rx="7" ry="5" transform="rotate(20 14 25)" fill="#ffc2d9" opacity="0.9"/>
          <ellipse cx="26" cy="25" rx="7" ry="5" transform="rotate(-20 26 25)" fill="#ffc2d9" opacity="0.9"/>
          <rect x="19" y="11" width="2" height="18" rx="1" fill="#4a2536"/>
        </svg>
      `;
      layer.appendChild(bf);
    }
  }

  // Interactive Cute Companions
  document.querySelectorAll('.companion-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.remove('bounce-cute');
      void card.offsetWidth;
      card.classList.add('bounce-cute');
      const animal = card.getAttribute('data-animal');
      if (animal === 'rabbit') {
        showMascotSpeech('Kelinci bilang: Irma manis banget! 🐰🩷');
      } else if (animal === 'cat') {
        showMascotSpeech('Meow~ Kucingnya mimpiin kamu 🐱💤');
      } else {
        showMascotSpeech('Kwek kwek! Jangan lupa senyum yaa! 🐤💛');
      }
    });
  });

  // Envelope Open -> Reveal Love Letter, Polaroid Gallery & WhatsApp Section
  function openLoveEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    tryAutoPlayMusic();
    loveEnvelope.classList.add('opened');
    currentStage = 'letter';
    teddyFlowerGroup.visible = true;

    for (let i = 0; i < 30; i++) {
      spawnParticle2D(window.innerWidth * 0.5, window.innerHeight * 0.45, true);
    }

    setTimeout(() => {
      letterSection.classList.add('revealed');
      gallerySection.classList.add('revealed');
      whatsappSection.classList.add('revealed');

      letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Staggered handwriting reveal for each paragraph
      const paras = document.querySelectorAll('.letter-para');
      paras.forEach((p, idx) => {
        setTimeout(() => {
          p.classList.add('visible');
        }, 350 + idx * 650);
      });

      // Staggered reveal for Polaroid photos
      const photos = document.querySelectorAll('.polaroid-card');
      photos.forEach((photo, idx) => {
        setTimeout(() => {
          photo.classList.add('show-photo');
        }, 1200 + idx * 260);
      });
    }, 750);
  }

  loveEnvelope.addEventListener('click', openLoveEnvelope);
  loveEnvelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openLoveEnvelope();
  });

  // Detect scroll into Gallery so Teddy Bear peeks playfully
  window.addEventListener(
    'scroll',
    () => {
      if (!envelopeOpened) return;
      const rect = gallerySection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7 && rect.bottom > 100) {
        currentStage = 'gallery';
      } else {
        currentStage = 'letter';
      }
    },
    { passive: true }
  );

  // Polaroid Lightbox
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxCloseBg = document.getElementById('lightbox-close-bg');

  document.querySelectorAll('.polaroid-card').forEach((card) => {
    card.addEventListener('click', () => {
      lightboxImg.src = card.getAttribute('data-src');
      lightboxCaption.textContent = card.getAttribute('data-caption');
      lightbox.classList.remove('hidden');
      showMascotSpeech('Cantik banget kan foto ini? 🥰📸');
    });
  });

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  }
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxCloseBg.addEventListener('click', closeLightbox);

  // WhatsApp Reply Button
  const waReplyBtn = document.getElementById('wa-reply-btn');
  waReplyBtn.addEventListener('click', () => {
    teddyHeartBurstTimer = 2.2;
    showMascotSpeech('I Love You Irma!! 💗💗💗');

    for (let i = 0; i < 40; i++) {
      spawnParticle2D(
        window.innerWidth * 0.5 + (Math.random() - 0.5) * 180,
        window.innerHeight * 0.7,
        true
      );
    }

    const cleanNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    if (!cleanNumber || cleanNumber.includes('X')) {
      alert(
        'Silakan isi nomor WhatsApp kamu terlebih dahulu pada variabel WHATSAPP_NUMBER di dalam file app.js (contoh: 6281234567890).'
      );
      return;
    }

    const encodedText = encodeURIComponent(WHATSAPP_MESSAGE);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener');
    }, 350);
  });

  // Periodic Sweet Pop-up Messages
  const sweetMessages = [
    'Haiii Sayang! 🥺',
    'Ada hadiah spesial buat kamu!',
    'Jangan lupa senyum yaa!',
    'Hehehe, kamu cantik banget! 🩷',
    'I Love You 💗'
  ];
  let sweetIdx = 0;
  setInterval(() => {
    if (currentStage === 'loading') return;
    showMascotSpeech(sweetMessages[sweetIdx % sweetMessages.length], 3200);
    sweetIdx++;
  }, 9500);

  /* =========================================================
     5. THREE.JS ANIMATION LOOP (7 TEDDY BEHAVIORS + 3D GIFT)
     ========================================================= */
  const clock = new THREE.Clock();
  let blinkTimer = 0;

  function animateThree() {
    requestAnimationFrame(animateThree);
    const dt = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Eye blinking every ~3.5 seconds
    blinkTimer += dt;
    const isBlinking = blinkTimer > 3.4 && blinkTimer < 3.56;
    if (blinkTimer >= 3.56) blinkTimer = 0;
    const eyeScaleY = isBlinking ? 0.12 : 1;
    leftEyeGroup.scale.y = eyeScaleY;
    rightEyeGroup.scale.y = eyeScaleY;

    // 3D Gift Box Animation
    if (giftGroup.visible) {
      const pulse = 1 + Math.sin(elapsed * 3.2) * 0.035;
      giftGroup.scale.set(pulse, pulse, pulse);
      giftGroup.rotation.y = Math.sin(elapsed * 1.1) * 0.25;
      giftGroup.position.set(0, -0.1, 0.4);

      if (giftOpened) {
        lidPivot.rotation.x = THREE.MathUtils.lerp(
          lidPivot.rotation.x,
          -Math.PI * 0.68,
          dt * 5
        );
        giftInnerLight.intensity = THREE.MathUtils.lerp(
          giftInnerLight.intensity,
          4.5,
          dt * 4
        );
      }
    }

    // 3D Teddy Bear Animations by Stage
    if (currentStage === 'loading') {
      // 1. Waving hand during loading
      teddyGroup.position.set(0, 0.55 + Math.sin(elapsed * 3) * 0.05, 0);
      teddyGroup.rotation.set(0, Math.sin(elapsed * 1.5) * 0.15, 0);
      rightArmPivot.rotation.z = 2.4 + Math.sin(elapsed * 9) * 0.35;
      leftArmPivot.rotation.z = -0.25;
    } else if (currentStage === 'gift') {
      // 2. Walking beside/toward the gift box + 3. Jumping when opened
      const walkX = THREE.MathUtils.lerp(teddyGroup.position.x, -1.45, dt * 2.5);
      let jumpY = -0.35 + Math.abs(Math.sin(elapsed * 3.5)) * 0.08;
      if (teddyJumpTimer > 0) {
        teddyJumpTimer -= dt;
        jumpY = -0.35 + Math.abs(Math.sin(elapsed * 12)) * 0.85;
        rightArmPivot.rotation.z = 2.6;
        leftArmPivot.rotation.z = -2.6;
      } else {
        rightArmPivot.rotation.z = 0.3 + Math.sin(elapsed * 4) * 0.2;
        leftArmPivot.rotation.z = -0.3 - Math.sin(elapsed * 4) * 0.2;
      }
      teddyGroup.position.set(walkX, jumpY, 0.2);
      teddyGroup.rotation.y = 0.42;
    } else if (currentStage === 'letter') {
      // 4. Sitting holding flower in bottom-right corner
      teddyGroup.position.set(
        THREE.MathUtils.lerp(teddyGroup.position.x, 1.65, dt * 3),
        THREE.MathUtils.lerp(teddyGroup.position.y, -1.05, dt * 3),
        THREE.MathUtils.lerp(teddyGroup.position.z, 0.8, dt * 3)
      );
      teddyGroup.scale.setScalar(0.68);
      teddyGroup.rotation.y = -0.45 + Math.sin(elapsed * 1.6) * 0.08;
      rightArmPivot.rotation.x = -0.75;
      rightArmPivot.rotation.z = 0.35;
      leftArmPivot.rotation.z = -0.25;
    } else if (currentStage === 'gallery') {
      // 6. Peeking playfully from the side when viewing photos
      teddyGroup.position.set(
        THREE.MathUtils.lerp(teddyGroup.position.x, 1.95, dt * 3),
        THREE.MathUtils.lerp(teddyGroup.position.y, -0.85, dt * 3),
        0.9
      );
      teddyGroup.scale.setScalar(0.68);
      teddyGroup.rotation.z = 0.18 + Math.sin(elapsed * 2.5) * 0.06;
      teddyGroup.rotation.y = -0.58;
    }

    // 7. Emitting hearts when WhatsApp button pressed
    if (teddyHeartBurstTimer > 0) {
      teddyHeartBurstTimer -= dt;
      teddyGroup.position.y += Math.abs(Math.sin(elapsed * 14)) * 0.12;
      rightArmPivot.rotation.z = 2.5;
      leftArmPivot.rotation.z = -2.5;
    }

    renderer.render(scene, camera);
  }
  animateThree();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
