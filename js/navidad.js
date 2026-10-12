/**
 * VELOX PLAY - EDICIÓN ESPECIAL NAVIDAD & AÑO NUEVO 🎄🎅❄️
 * Animación de Nieve Flotante, Cascabeles Sintetizados y Compra Segura VIP
 */

document.addEventListener('DOMContentLoaded', () => {
  initSnowCanvas();
  initTabsFilter();
  initAudioSystem();
  initModals();
  initApkDownloads();
  generateChristmasLights();
});

// ===================================================================
// SISTEMA DE COMPRA VIP POR WHATSAPP (NÚMERO PRIVADO / OCULTO)
// ===================================================================
const _0x_v = "NTI1NjE2ODQwNTI0"; // 525616840524 en Base64

function openVipWhatsApp(source = 'Boton Navideño') {
  playFestiveChime();

  const phone = atob(_0x_v);
  const msg = `🎄 ¡Hola Velox Play! Quiero adquirir el Pase VIP Navideño Cero Anuncios (${source}) para disfrutar películas, series, animes, doramas y fútbol sin interrupciones. ¿Me indican los pasos de activación inmediata? 🎅⭐`;
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;

  window.open(url, '_blank');
}

window.openVipWhatsApp = openVipWhatsApp;

// ===================================================================
// GENERADOR DINÁMICO DE LUCES NAVIDEÑAS EN EL TECHO
// ===================================================================
function generateChristmasLights() {
  const container = document.querySelector('.christmas-lights');
  if (!container) return;

  const count = Math.floor(window.innerWidth / 28);
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const bulb = document.createElement('div');
    bulb.className = 'light-bulb';
    container.appendChild(bulb);
  }
}

window.addEventListener('resize', () => {
  generateChristmasLights();
});

// ===================================================================
// SISTEMA DE AUDIO NAVIDEÑO (CASCABELES / JINGLE CHIMES)
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
      soundToggleBtn.innerHTML = '<i class="bi bi-bell-fill glow-gold"></i> <span>Música: ON</span>';
      soundToggleBtn.classList.add('active');
      playJingleBellsTune();
    } else {
      soundToggleBtn.innerHTML = '<i class="bi bi-bell-slash"></i> <span>Música: OFF</span>';
      soundToggleBtn.classList.remove('active');
    }
  });
}

function playTone(freq, type = 'sine', duration = 0.25, gainVal = 0.12) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

// Melodía festiva de campanitas (Jingle Bells snippet)
function playJingleBellsTune() {
  if (!soundEnabled || !audioCtx) return;
  // Notas: E4, E4, E4, E4, E4, E4, E4, G4, C4, D4, E4
  const notes = [
    { f: 659.25, d: 200 }, // E5
    { f: 659.25, d: 200 }, // E5
    { f: 659.25, d: 400 }, // E5
    { f: 659.25, d: 200 }, // E5
    { f: 659.25, d: 200 }, // E5
    { f: 659.25, d: 400 }, // E5
    { f: 659.25, d: 200 }, // E5
    { f: 783.99, d: 200 }, // G5
    { f: 523.25, d: 200 }, // C5
    { f: 587.33, d: 200 }, // D5
    { f: 659.25, d: 500 }  // E5
  ];

  let elapsed = 0;
  notes.forEach(note => {
    setTimeout(() => {
      playTone(note.f, 'triangle', note.d / 1000, 0.15);
    }, elapsed);
    elapsed += note.d + 50;
  });
}

function playFestiveChime() {
  if (!soundEnabled || !audioCtx) return;
  [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
    setTimeout(() => {
      playTone(f, 'sine', 0.35, 0.12);
    }, i * 90);
  });
}

// ===================================================================
// LIENZO DE NIEVE CAYENDO (SNOWFALL CANVAS)
// ===================================================================
function initSnowCanvas() {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const flakes = [];
  const maxFlakes = window.innerWidth < 768 ? 45 : 100;

  for (let i = 0; i < maxFlakes; i++) {
    flakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      density: Math.random() * maxFlakes,
      speedY: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.7 + 0.3
    });
  }

  let angle = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    angle += 0.01;

    for (let f of flakes) {
      f.y += f.speedY;
      f.x += Math.sin(angle + f.density) * 0.6 + f.speedX;

      if (f.y > height + 10) {
        f.y = -10;
        f.x = Math.random() * width;
      }
      if (f.x > width + 10) f.x = -10;
      if (f.x < -10) f.x = width + 10;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(render);
  }

  render();
}

// ===================================================================
// FILTRO DE CATEGORÍAS (PELÍCULAS, SERIES, ANIMES, DORAMAS, FÚTBOL)
// ===================================================================
function initTabsFilter() {
  const tabs = document.querySelectorAll('.festive-tab-btn');
  const cards = document.querySelectorAll('.content-card-col');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      playTone(523.25, 'triangle', 0.15, 0.1);

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
      playFestiveChime();

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
// TOAST ELEGANTE AL DESCARGAR APK
// ===================================================================
function initApkDownloads() {
  const dlButtons = document.querySelectorAll('.btn-apk-download, .btn-hero-download, .btn-hero-tv');

  dlButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playFestiveChime();
      showChristmasToast();
    });
  });
}

function showChristmasToast() {
  let toastEl = document.getElementById('christmas-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'christmas-toast';
    toastEl.style.cssText = `
      position: fixed;
      top: 95px;
      right: 25px;
      z-index: 1060;
      background: rgba(11, 19, 43, 0.96);
      border: 2px solid #ffd166;
      border-radius: 18px;
      padding: 16px 24px;
      color: #fff;
      box-shadow: 0 10px 35px rgba(0,0,0,0.85), 0 0 25px rgba(255, 209, 102, 0.4);
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.4s ease;
      transform: translateY(-20px);
      opacity: 0;
    `;
    toastEl.innerHTML = `
      <div style="font-size: 2.2rem;">🎅</div>
      <div>
        <div style="font-weight: 800; color: #ffd166; font-size: 1.05rem;">¡Descarga Navideña Lista!</div>
        <div style="font-size: 0.85rem; color: #d0e1fd;">Instala el APK y disfruta todo en Velox Play.</div>
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
