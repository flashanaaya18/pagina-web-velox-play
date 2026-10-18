/**
 * VELOX PLAY - EDICIÓN ESPECIAL ONE PIECE (RUMBO AL GRAND LINE)
 * Interactividad de Personajes, Efectos Haki, Canvas de Berries Doradas y Audio Pirata
 */

document.addEventListener('DOMContentLoaded', () => {
  initOnePieceCanvas();
  initOnePieceTabs();
  initOnePieceAudio();
  initHakiClickEffects();
  initLuffyInteractiveCompanion();
});

// ===================================================================
// SISTEMA VIP DE COMPRA POR WHATSAPP (NÚMERO PRIVADO PROTEGIDO)
// ===================================================================
const _0x_v = "NTI1NjE2ODQwNTI0"; // WhatsApp VIP Token Protegido

function openVipWhatsApp(planName = 'Pase VIP Pirata', price = null) {
  playOnePieceTone(520, 'triangle', 0.25);
  
  const phone = atob(_0x_v);
  let msg = '';
  if (price) {
    msg = `🏴‍☠️ ¡Hola Velox Play! Quiero unirme a la tripulación VIP Cero Anuncios del plan: ${planName} ($${price} MXN). ¿Cuáles son los datos de transferencia para activación inmediata? 👑⭐`;
  } else {
    msg = `🏴‍☠️ ¡Hola Velox Play! Me interesa comprar el Pase VIP Cero Anuncios (${planName}). ¿Me comparten los métodos de pago y activación inmediata? 💎`;
  }
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
  
  window.open(url, '_blank');
}

window.openVipWhatsApp = openVipWhatsApp;

// ===================================================================
// COMPAÑERO INTERACTIVO LUFFY & CAMBIO DE PERSONAJES
// ===================================================================
const OP_CHARACTERS = [
  {
    name: 'Luffy Sombrero de Paja',
    mode: 'Capitán',
    img: 'assets/luffy_strawhat.png',
    quotes: [
      '¡Voy a ser el Rey del Streaming! 👑🏴‍☠️',
      '¡Descarga el APK para tu Smart TV y Celular! 📺📲',
      '¡Shishishi! ¡Con el Pase VIP no hay anuncios!',
      '¡Rumbo al Grand Line con películas en 4K! 🌊'
    ],
    freq: 580
  },
  {
    name: 'Luffy Gear 5 (Sun God Nika)',
    mode: 'Gear 5',
    img: 'assets/luffy_gear5.png',
    quotes: [
      '¡JAJAJAJA! ¡El poder más ridículo del mundo: CERO CORTES! ⚡',
      '¡TAMBORES DE LA LIBERACIÓN! ¡Streaming libre sin publicidad! 🥁✨',
      '¡GOMU GOMU NO... ACTIVACIÓN VIP INSTANTÁNEA! 🔥'
    ],
    freq: 880
  },
  {
    name: 'Roronoa Zoro',
    mode: 'Espadachín',
    img: 'assets/zoro_swordsman.png',
    quotes: [
      '¡Estilo de Tres Espadas: No me pierdo ningún partido de fútbol! ⚔️⚽',
      '¿Dónde está la pantalla? Bueno, ¡mientras sea Full HD no importa!',
      'Servidores tan rápidos que cortan el lag en dos. ⚡'
    ],
    freq: 420
  },
  {
    name: 'Vinsmoke Sanji',
    mode: 'Cocinero',
    img: 'assets/sanji_firekick.png',
    quotes: [
      '¡Diable Jambe! ¡El mejor menú de series y películas para ti! 🔥🍿',
      '¡Mellorine! La calidad 4K de Velox Play es insuperable. ✨',
      '¡Una transmisión caliente y lista para servir! 🍽️'
    ],
    freq: 640
  },
  {
    name: 'Tony Tony Chopper',
    mode: 'Médico',
    img: 'assets/chopper_mascot.png',
    quotes: [
      '¡No me digas que el APK es genial, idiota! ¡Me hace feliz! 🌸🥰',
      '¡Tengo la receta perfecta: Velox Play en tu Smart TV!',
      '¡Algodón de azúcar y maratón de anime todo el día! 🍭'
    ],
    freq: 720
  }
];

let currentCharIdx = 0;

function interactLuffy() {
  currentCharIdx = (currentCharIdx + 1) % OP_CHARACTERS.length;
  const char = OP_CHARACTERS[currentCharIdx];

  const imgEl = document.getElementById('luffyAvatarImg');
  const bubbleEl = document.getElementById('luffySpeechBubble');
  const badgeEl = document.getElementById('luffyModeBadge');

  if (imgEl) {
    imgEl.style.transform = 'scale(0.65) rotate(15deg)';
    setTimeout(() => {
      imgEl.src = char.img;
      imgEl.style.transform = '';
    }, 140);
  }

  if (badgeEl) {
    badgeEl.textContent = char.mode;
  }

  if (bubbleEl) {
    const randomQuote = char.quotes[Math.floor(Math.random() * char.quotes.length)];
    bubbleEl.innerHTML = `<strong>${char.name}:</strong><br>"${randomQuote}"`;
    bubbleEl.classList.remove('animate__pulse');
    void bubbleEl.offsetWidth; // Reflow
    bubbleEl.classList.add('animate__pulse');
  }

  playOnePieceTone(char.freq, 'triangle', 0.22);
  triggerHakiBurst();
}

window.interactLuffy = interactLuffy;

// ===================================================================
// CANVAS DE MONEDAS BERRIES Y PARTÍCULAS DORADAS GRAND LINE
// ===================================================================
function initOnePieceCanvas() {
  const canvas = document.getElementById('onepiece-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Generar partículas (Berries doradas y chispas de luz)
  const particles = [];
  const particleCount = Math.min(window.innerWidth < 768 ? 22 : 45, 50);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 2,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.6 + 0.2,
      goldPulse: Math.random() * Math.PI,
      isCoin: Math.random() > 0.6
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.goldPulse += 0.03;

      if (p.y < -20) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 10;
      if (p.x > width + 20) p.x = -10;

      const alpha = Math.sin(p.goldPulse) * 0.3 + p.opacity;

      if (p.isCoin) {
        // Moneda Berries dorada
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 183, 3, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffd166';
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 230, 100, ${alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Chispa brillante
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffb703';
        ctx.fill();
      }
    });

    ctx.shadowBlur = 0;
    requestAnimationFrame(render);
  }
  render();
}

// ===================================================================
// EFECTO ONDA DE CHOQUE HAKI AL HACER CLIC
// ===================================================================
function initHakiClickEffects() {
  window.addEventListener('click', (e) => {
    // No en enlaces/botones para no saturar si ya tienen animación
    const ripple = document.createElement('div');
    ripple.className = 'haki-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 700);
  });
}

function triggerHakiBurst() {
  const luffyWidget = document.getElementById('luffyInteractiveFloating');
  if (!luffyWidget) return;
  const rect = luffyWidget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const ripple = document.createElement('div');
  ripple.className = 'haki-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.borderColor = '#ffb703';
  document.body.appendChild(ripple);

  setTimeout(() => {
    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
  }, 700);
}

// ===================================================================
// SISTEMA DE AUDIO DE AVENTURA PIRATA (WEB AUDIO API)
// ===================================================================
let opAudioCtx = null;
let opSoundEnabled = false;

function initOnePieceAudio() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!opAudioCtx) {
      opAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    opSoundEnabled = !opSoundEnabled;

    if (opSoundEnabled) {
      soundBtn.innerHTML = '<i class="bi bi-volume-up-fill glow-gold"></i> <span>Audio: ON</span>';
      soundBtn.classList.add('active');
      playTreasureFanfare();
    } else {
      soundBtn.innerHTML = '<i class="bi bi-volume-mute"></i> <span>Audio: OFF</span>';
      soundBtn.classList.remove('active');
    }
  });
}

function playOnePieceTone(freq = 440, type = 'sine', duration = 0.25) {
  if (!opSoundEnabled || !opAudioCtx) return;
  try {
    if (opAudioCtx.state === 'suspended') opAudioCtx.resume();
    const osc = opAudioCtx.createOscillator();
    const gain = opAudioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, opAudioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, opAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, opAudioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(opAudioCtx.destination);

    osc.start();
    osc.stop(opAudioCtx.currentTime + duration);
  } catch (e) {}
}

function playTreasureFanfare() {
  if (!opSoundEnabled || !opAudioCtx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do agudo
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playOnePieceTone(freq, 'triangle', 0.35);
    }, idx * 120);
  });
}

// ===================================================================
// FILTROS DE CATEGORÍAS DEL CATÁLOGO (ANIME, PELÍCULAS, FÚTBOL, ETC.)
// ===================================================================
function initOnePieceTabs() {
  const tabs = document.querySelectorAll('.op-tab-btn');
  const cards = document.querySelectorAll('.content-card-col');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      playOnePieceTone(480, 'sine', 0.1);

      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.classList.add('animate__animated', 'animate__fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initLuffyInteractiveCompanion() {
  // Configuración inicial de diálogo
  const bubble = document.getElementById('luffySpeechBubble');
  if (bubble) {
    setTimeout(() => {
      bubble.classList.add('animate__animated', 'animate__pulse');
    }, 1000);
  }
}
