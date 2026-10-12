/**
 * VELOX PLAY - EDICIÓN ESPECIAL HALLOWEEN
 * Interactividad, Sonidos Spooky, Partículas Neón y Redirección Segura VIP
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTabsFilter();
  initAudioSystem();
  initModals();
  initApkDownloads();
  initMagicCursorTrail();
  initInteractiveHalloweenCharacters();
});

// ===================================================================
// SISTEMA DE COMPRA VIP POR WHATSAPP (NÚMERO PRIVADO / OCULTO)
// Cumple con el requerimiento de compra sin exponer el número directamente
// ===================================================================
const _0x_v = "NTI1NjE2ODQwNTI0"; // 525616840524 en Base64

function openVipWhatsApp(source = 'Boton Principal') {
  playSpookyTone(440, 'triangle', 0.25);
  
  const phone = atob(_0x_v);
  const msg = `🎃 ¡Hola Velox Play! Me interesa comprar el acceso VIP Cero Anuncios (${source}). ¿Me comparten los métodos de pago y activación inmediata?`;
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
  
  window.open(url, '_blank');
}

window.openVipWhatsApp = openVipWhatsApp;

// ===================================================================
// SISTEMA DE AUDIO SPOOKY (WEB AUDIO API - SIN DEPENDENCIAS EXTERNAS)
// ===================================================================
let audioCtx = null;
let soundEnabled = false;

function initAudioSystem() {
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (!soundToggleBtn) return;

  soundToggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      soundToggleBtn.innerHTML = '<i class="bi bi-volume-up-fill glow-orange"></i> <span>Sonido: ON</span>';
      soundToggleBtn.classList.add('active');
      playSpookyChime();
    } else {
      soundToggleBtn.innerHTML = '<i class="bi bi-volume-mute"></i> <span>Sonido: OFF</span>';
      soundToggleBtn.classList.remove('active');
    }
  });
}

function playSpookyTone(freq = 300, type = 'sine', duration = 0.3) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

function playSpookyChime() {
  if (!soundEnabled || !audioCtx) return;
  [523.25, 493.88, 440, 392, 329.63].forEach((f, i) => {
    setTimeout(() => {
      playSpookyTone(f, 'sine', 0.4);
    }, i * 120);
  });
}

// ===================================================================
// PARTÍCULAS SPOOKY / BRASAS FLOTANTES DE HALLOWEEN
// ===================================================================
function initParticleCanvas() {
  const canvas = document.getElementById('halloween-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = window.innerWidth < 768 ? 35 : 70;
  const colors = ['#ff7518', '#ff5400', '#9d4edd', '#39ff14', '#ffffff'];

  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -Math.random() * 1.2 - 0.3,
      opacity: Math.random() * 0.7 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * 0.05
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity += p.pulse;

      if (p.opacity > 0.85 || p.opacity < 0.2) {
        p.pulse = -p.pulse;
      }

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    requestAnimationFrame(render);
  }

  render();
}

// ===================================================================
// FILTRO DE CATEGORÍAS (PELÍCULAS, SERIES, ANIMES, DORAMAS, FÚTBOL)
// ===================================================================
function initTabsFilter() {
  const tabs = document.querySelectorAll('.halloween-tab-btn');
  const cards = document.querySelectorAll('.content-card-col');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      playSpookyTone(380, 'sine', 0.15);

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'block';
          card.classList.add('animate__animated', 'animate__fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===================================================================
// MODAL DE DETALLES Y PREVIEW DE CONTENIDO
// ===================================================================
function initModals() {
  const previewModalEl = document.getElementById('previewModal');
  if (!previewModalEl) return;

  const modalTitle = document.getElementById('modalContentTitle');
  const modalCategory = document.getElementById('modalContentCategory');
  const modalDesc = document.getElementById('modalContentDesc');
  const modalQuality = document.getElementById('modalContentQuality');
  const modalImg = document.getElementById('modalContentImg');

  const triggers = document.querySelectorAll('.btn-preview-trigger');

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playSpookyTone(550, 'triangle', 0.2);

      const title = btn.getAttribute('data-title');
      const cat = btn.getAttribute('data-category');
      const desc = btn.getAttribute('data-desc');
      const quality = btn.getAttribute('data-quality') || '4K Ultra HD';
      const img = btn.getAttribute('data-img');

      if (modalTitle) modalTitle.innerText = title;
      if (modalCategory) modalCategory.innerText = cat;
      if (modalDesc) modalDesc.innerText = desc;
      if (modalQuality) modalQuality.innerText = quality;
      if (modalImg && img) modalImg.src = img;

      const modal = new bootstrap.Modal(previewModalEl);
      modal.show();
    });
  });
}

// ===================================================================
// NOTIFICACIÓN ELEGANTE AL DESCARGAR APK
// ===================================================================
function initApkDownloads() {
  const dlButtons = document.querySelectorAll('.btn-apk-download, .btn-hero-download, .btn-hero-tv');

  dlButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playSpookyTone(600, 'sine', 0.25);
      showDownloadToast();
    });
  });
}

function showDownloadToast() {
  let toastEl = document.getElementById('halloween-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'halloween-toast';
    toastEl.style.cssText = `
      position: fixed;
      top: 90px;
      right: 25px;
      z-index: 1060;
      background: rgba(18, 10, 32, 0.95);
      border: 1px solid #ff7518;
      border-radius: 16px;
      padding: 16px 22px;
      color: #fff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(255, 117, 24, 0.4);
      display: flex;
      align-items: center;
      gap: 14px;
      transition: all 0.4s ease;
      transform: translateY(-20px);
      opacity: 0;
    `;
    toastEl.innerHTML = `
      <div style="font-size: 2rem;">🎃</div>
      <div>
        <div style="font-weight: 800; color: #ff7518;">¡Descarga Iniciada!</div>
        <div style="font-size: 0.85rem; color: #d0cce3;">Instala el APK y disfruta todo en Velox Play.</div>
      </div>
    `;
    document.body.appendChild(toastEl);
  }

  setTimeout(() => {
    toastEl.style.transform = 'translateY(0)';
    toastEl.style.opacity = '1';
  }, 50);

  setTimeout(() => {
    toastEl.style.transform = 'translateY(-20px)';
    toastEl.style.opacity = '0';
  }, 4500);
}

// ===================================================================
// CURSOR MÁGICO DE HALLOWEEN (DESTELLOS Y BRASAS EN MOVIMIENTO)
// ===================================================================
function initMagicCursorTrail() {
  if (window.innerWidth < 768) return; // Solo en PC / pantallas con puntero

  const colors = ['#ff7518', '#ff5400', '#9d4edd', '#39ff14', '#ffd166'];
  let lastX = 0;
  let lastY = 0;
  let throttle = 0;

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - throttle < 35) return;
    throttle = now;

    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-magic-sparkle';
    sparkle.style.left = `${e.clientX - 4}px`;
    sparkle.style.top = `${e.clientY - 4}px`;
    const col = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.background = col;
    sparkle.style.color = col;

    document.body.appendChild(sparkle);

    const destX = (Math.random() - 0.5) * 30;
    const destY = (Math.random() - 0.5) * 30 + 15;

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => {
      sparkle.remove();
    }, 450);
  });
}

// ===================================================================
// INTERACCIONES CON PERSONAJES DE HALLOWEEN FLOTANTES
// ===================================================================
function initInteractiveHalloweenCharacters() {
  const pumpkinBat = document.querySelector('.pumpkin-batwings-floating');
  if (pumpkinBat) {
    pumpkinBat.addEventListener('click', () => {
      playSpookyTone(700, 'sawtooth', 0.35);
      showCharacterToast("🎃 ¡Calabaza Voladora Velox!", "¡Descarga Velox Play y no te pierdas el terror!");
    });
  }

  const ghostMascot = document.querySelector('.ghost-mascot-sticker');
  if (ghostMascot) {
    ghostMascot.addEventListener('click', () => {
      playSpookyChime();
    });
  }
}

function showCharacterToast(title, subtitle) {
  let toastEl = document.getElementById('char-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'char-toast';
    toastEl.style.cssText = `
      position: fixed;
      bottom: 120px;
      left: 25px;
      z-index: 1060;
      background: rgba(18, 10, 32, 0.95);
      border: 1px solid #9d4edd;
      border-radius: 16px;
      padding: 14px 20px;
      color: #fff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(157, 78, 221, 0.4);
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.4s ease;
      transform: translateY(20px);
      opacity: 0;
    `;
    document.body.appendChild(toastEl);
  }

  toastEl.innerHTML = `
    <div style="font-size: 1.8rem;">🦇</div>
    <div>
      <div style="font-weight: 800; color: #ff7518;">${title}</div>
      <div style="font-size: 0.82rem; color: #d0cce3;">${subtitle}</div>
    </div>
  `;

  setTimeout(() => {
    toastEl.style.transform = 'translateY(0)';
    toastEl.style.opacity = '1';
  }, 50);

  setTimeout(() => {
    toastEl.style.transform = 'translateY(20px)';
    toastEl.style.opacity = '0';
  }, 4000);
}

