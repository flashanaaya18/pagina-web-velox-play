/**
 * VELOX PLAY TV - CONTROL REMOTO D-PAD & MOTOR DE NAVEGACIÓN PARA SMART TV
 * Diseñado para navegadores de Smart TV (Samsung Tizen, LG webOS, Android TV, Fire TV, etc.)
 */

// Token WhatsApp VIP protegido
const _0x_v = "NTI1NjE2ODQwNTI0";

document.addEventListener('DOMContentLoaded', () => {
  initTvClock();
  initSpatialNavigation();
  initTvAudio();
  initTvTabs();
  initTvModals();
});

// ===================================================================
// RELOJ DIGITAL EN VIVO PARA PANTALLA TV
// ===================================================================
function initTvClock() {
  const clockEl = document.getElementById('tvLiveClock');
  if (!clockEl) return;
  
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// ===================================================================
// SISTEMA DE AUDIO PARA CONTROL REMOTO (WEB AUDIO API)
// ===================================================================
let tvAudioCtx = null;

function initTvAudio() {
  // Inicialización bajo demanda tras la primera interacción
  const enableAudio = () => {
    if (!tvAudioCtx) {
      tvAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  };
  window.addEventListener('keydown', enableAudio, { once: true });
  window.addEventListener('click', enableAudio, { once: true });
}

function playTvSound(freq = 420, type = 'sine', duration = 0.08) {
  if (!tvAudioCtx) return;
  try {
    const osc = tvAudioCtx.createOscillator();
    const gain = tvAudioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, tvAudioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, tvAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, tvAudioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(tvAudioCtx.destination);
    osc.start();
    osc.stop(tvAudioCtx.currentTime + duration);
  } catch (e) {
    // Silencioso si el navegador restringe audio
  }
}

// ===================================================================
// MOTOR DE NAVEGACIÓN ESPACIAL D-PAD (FLECHAS, OK, ATRÁS DE CONTROL REMOTO)
// ===================================================================
let currentFocusedEl = null;

function initSpatialNavigation() {
  // Encontrar todos los elementos enfocables
  const focusables = Array.from(document.querySelectorAll('.tv-focusable'));
  if (focusables.length === 0) return;

  // Asignar primer elemento enfocado
  setTvFocus(focusables[0]);

  // Listener de teclado / control remoto de Smart TV
  window.addEventListener('keydown', (e) => {
    // Teclas estándar y códigos de control remoto de Samsung/LG/Android TV
    const key = e.key;
    const keyCode = e.keyCode;

    // Verificar si modal de reproductor está abierto
    const playerModal = document.getElementById('tvPlayerModal');
    const qrModal = document.getElementById('tvQrModal');
    const isModalOpen = (playerModal && playerModal.classList.contains('active')) || 
                        (qrModal && qrModal.classList.contains('active'));

    // Tecla ATRÁS / BACK (Escape, Backspace, Android Back keyCode 4, Samsung 10009)
    if (key === 'Escape' || key === 'Backspace' || keyCode === 4 || keyCode === 10009 || keyCode === 27) {
      if (isModalOpen) {
        e.preventDefault();
        closeAllTvModals();
        playTvSound(300, 'triangle', 0.12);
        return;
      }
    }

    // Teclas direccionales
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key) || 
        [38, 40, 37, 39].includes(keyCode)) {
      e.preventDefault();
      let direction = '';
      if (key === 'ArrowUp' || keyCode === 38) direction = 'up';
      if (key === 'ArrowDown' || keyCode === 40) direction = 'down';
      if (key === 'ArrowLeft' || keyCode === 37) direction = 'left';
      if (key === 'ArrowRight' || keyCode === 39) direction = 'right';

      navigateSpatial(direction);
      playTvSound(520, 'sine', 0.05);
      return;
    }

    // Tecla OK / ENTER (Enter, Space, keyCode 13, Samsung Enter 29443)
    if (key === 'Enter' || key === ' ' || keyCode === 13 || keyCode === 29443) {
      if (currentFocusedEl) {
        e.preventDefault();
        playTvSound(740, 'triangle', 0.15);
        currentFocusedEl.click();
      }
    }
  });

  // Soporte para puntero/ratón (LG Magic Remote o mouse de Smart TV)
  focusables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      setTvFocus(el, false);
    });
  });
}

function setTvFocus(element, shouldScroll = true) {
  if (!element) return;
  if (currentFocusedEl) {
    currentFocusedEl.classList.remove('tv-focused');
  }
  currentFocusedEl = element;
  currentFocusedEl.classList.add('tv-focused');
  currentFocusedEl.focus();

  if (shouldScroll) {
    // Si está dentro de una fila con scroll horizontal
    const scroller = currentFocusedEl.closest('.tv-row-scroller');
    if (scroller) {
      const cardRect = currentFocusedEl.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const scrollOffset = (cardRect.left - scrollerRect.left) - (scrollerRect.width / 2) + (cardRect.width / 2);
      scroller.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }

    // Mantener la fila visible verticalmente en la pantalla
    currentFocusedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }
}

function navigateSpatial(direction) {
  if (!currentFocusedEl) {
    const first = document.querySelector('.tv-focusable');
    if (first) setTvFocus(first);
    return;
  }

  // Filtrar elementos enfocables visibles en pantalla (o dentro del modal activo si hay uno)
  const isModalActive = document.querySelector('.tv-player-modal.active, .tv-qr-modal.active');
  let candidates;
  if (isModalActive) {
    candidates = Array.from(isModalActive.querySelectorAll('.tv-focusable'));
  } else {
    candidates = Array.from(document.querySelectorAll('.tv-app-wrapper .tv-focusable'));
  }

  const currentRect = currentFocusedEl.getBoundingClientRect();
  const currentCenter = {
    x: currentRect.left + currentRect.width / 2,
    y: currentRect.top + currentRect.height / 2
  };

  let bestCandidate = null;
  let bestScore = Infinity;

  candidates.forEach(candidate => {
    if (candidate === currentFocusedEl) return;
    const rect = candidate.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    const dx = center.x - currentCenter.x;
    const dy = center.y - currentCenter.y;

    let isDirectionValid = false;
    let primaryDist = 0;
    let secondaryDist = 0;

    switch (direction) {
      case 'left':
        isDirectionValid = dx < -10;
        primaryDist = Math.abs(dx);
        secondaryDist = Math.abs(dy);
        break;
      case 'right':
        isDirectionValid = dx > 10;
        primaryDist = Math.abs(dx);
        secondaryDist = Math.abs(dy);
        break;
      case 'up':
        isDirectionValid = dy < -10;
        primaryDist = Math.abs(dy);
        secondaryDist = Math.abs(dx);
        break;
      case 'down':
        isDirectionValid = dy > 10;
        primaryDist = Math.abs(dy);
        secondaryDist = Math.abs(dx);
        break;
    }

    if (isDirectionValid) {
      // Ponderación de distancia: penalizar desviaciones ortogonales
      const score = primaryDist + (secondaryDist * 2.5);
      if (score < bestScore) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }
  });

  if (bestCandidate) {
    setTvFocus(bestCandidate);
  }
}

// ===================================================================
// PESTAÑAS Y FILTROS DE CATEGORÍAS TV
// ===================================================================
function initTvTabs() {
  const tabs = document.querySelectorAll('.tv-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-target');
      if (targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const firstCard = targetSection.querySelector('.tv-focusable');
          if (firstCard) {
            setTimeout(() => setTvFocus(firstCard), 300);
          }
        }
      }
    });
  });
}

// ===================================================================
// REPRODUCTOR STREAMING MODAL EN SMART TV
// ===================================================================
function initTvModals() {
  // Manejadores para abrir player al presionar tarjetas
  const cards = document.querySelectorAll('.tv-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title') || 'Canal / Película Velox';
      const meta = card.getAttribute('data-meta') || 'Streaming HD';
      const img = card.querySelector('img') ? card.querySelector('img').src : 'assets/hero_halloween.jpg';
      openTvPlayer(title, meta, img);
    });
  });
}

function openTvPlayer(title, meta, posterSrc) {
  const modal = document.getElementById('tvPlayerModal');
  if (!modal) return;

  document.getElementById('tvPlayerTitle').textContent = title;
  document.getElementById('tvPlayerMeta').textContent = meta;
  document.getElementById('tvPlayerMockBg').src = posterSrc;

  modal.classList.add('active');
  const closeBtn = document.getElementById('tvPlayerCloseBtn');
  if (closeBtn) setTvFocus(closeBtn);
}

function closeAllTvModals() {
  document.querySelectorAll('.tv-player-modal, .tv-qr-modal').forEach(m => m.classList.remove('active'));
  // Devolver el foco a un elemento de la vista principal
  const heroBtn = document.querySelector('.tv-hero-actions .tv-focusable') || document.querySelector('.tv-focusable');
  if (heroBtn) setTvFocus(heroBtn);
}

window.closeAllTvModals = closeAllTvModals;

// ===================================================================
// ACTIVACIÓN VIP EN TV (MODAL QR CODE PARA ESCANEAR CON TELÉFONO)
// ===================================================================
function openTvVipModal(planName = 'Pase VIP TV') {
  const modal = document.getElementById('tvQrModal');
  if (!modal) return;

  const phone = atob(_0x_v);
  const msg = `📺 ¡Hola Velox Play! Estoy en mi Smart TV y quiero activar mi cuenta VIP (${planName}). ¿Me comparten los datos de transferencia para activación inmediata? ⭐`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;

  // Actualizar enlace directo
  const directLink = document.getElementById('tvWhatsappDirectBtn');
  if (directLink) {
    directLink.href = whatsappUrl;
  }

  // Generar URL para código QR de alta resolución
  const qrImg = document.getElementById('tvQrCodeImg');
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(whatsappUrl)}&color=090511&bgcolor=ffffff`;
  }

  modal.classList.add('active');
  const qrCloseBtn = document.getElementById('tvQrCloseBtn');
  if (qrCloseBtn) setTvFocus(qrCloseBtn);
}

window.openTvVipModal = openTvVipModal;

// ===================================================================
// DESCARGA DIRECTA DE APK TV (DESDE NAVEGADOR ANDROID TV O FIRESTICK)
// ===================================================================
function downloadTvApk(apkName = 'velox_play_tv.apk') {
  playTvSound(880, 'triangle', 0.2);
  const downloadLink = document.createElement('a');
  downloadLink.href = `apks/${apkName}`;
  downloadLink.download = apkName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // Notificación en pantalla
  showTvToast(`Iniciando descarga de ${apkName}... Abre tu instalador en Android TV.`);
}

window.downloadTvApk = downloadTvApk;

function showTvToast(msg) {
  let toast = document.getElementById('tvToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'tvToastNotification';
    toast.style.cssText = `
      position: fixed;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #ff7518, #9d4edd);
      color: #fff;
      font-weight: 800;
      font-size: 1.1rem;
      padding: 14px 28px;
      border-radius: 20px;
      box-shadow: 0 10px 35px rgba(0,0,0,0.8), 0 0 25px rgba(255, 117, 24, 0.6);
      z-index: 2000;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3500);
}
