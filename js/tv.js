/**
 * VELOX PLAY TV - CONTROL REMOTO D-PAD & MOTOR DE NAVEGACIÓN UNIVERSAL PARA SMART TV
 * Diseñado y optimizado para:
 * - Android TV / Google TV / Fire TV Stick (D-Pad keyCodes: 19, 20, 21, 22, OK: 23, 66, Back: 4)
 * - Samsung Smart TV (Tizen OS) (Arrows: 37-40, OK: 13, 29443, Back: 10009)
 * - LG Smart TV (webOS) (Arrows: 37-40, OK: 13, Back: 461, Magic Remote pointer)
 * - Navegadores TV genéricos (Silk, Opera TV/Vewd, Odin, Puffin, TV Bro)
 */

// Token WhatsApp VIP protegido
const _0x_v = "NTI1NjE2ODQwNTI0";

let currentFocusedEl = null;
let tvAudioCtx = null;

// Registro preventivo de teclas en Samsung Tizen
if (typeof window !== 'undefined' && window.tizen && window.tizen.tvinputdevice) {
  try {
    ['MediaPlay', 'MediaPause', 'MediaPlayPause', 'MediaStop', 'Return', 'Exit'].forEach(k => {
      try { window.tizen.tvinputdevice.registerKey(k); } catch (e) {}
    });
  } catch (e) {}
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  initTvClock();
  initTvAudio();
  initTvTabs();
  initTvModals();
  initSpatialNavigation();
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
function initTvAudio() {
  const enableAudio = () => {
    if (!tvAudioCtx) {
      try {
        tvAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
  };
  window.addEventListener('keydown', enableAudio, { once: true });
  window.addEventListener('click', enableAudio, { once: true });
}

function playTvSound(freq = 460, type = 'sine', duration = 0.07) {
  if (!tvAudioCtx) return;
  try {
    if (tvAudioCtx.state === 'suspended') {
      tvAudioCtx.resume();
    }
    const osc = tvAudioCtx.createOscillator();
    const gain = tvAudioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, tvAudioCtx.currentTime);
    gain.gain.setValueAtTime(0.06, tvAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, tvAudioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(tvAudioCtx.destination);
    osc.start();
    osc.stop(tvAudioCtx.currentTime + duration);
  } catch (e) {}
}

// ===================================================================
// MOTOR DE NAVEGACIÓN UNIVERSAL D-PAD PARA CONTROL REMOTO DE TV
// ===================================================================
function initSpatialNavigation() {

  // Detectores normalizados para teclas de control remoto
  function isUp(e) {
    return e.key === 'ArrowUp' || e.key === 'Up' || e.keyCode === 38 || e.keyCode === 19;
  }
  function isDown(e) {
    return e.key === 'ArrowDown' || e.key === 'Down' || e.keyCode === 40 || e.keyCode === 20;
  }
  function isLeft(e) {
    return e.key === 'ArrowLeft' || e.key === 'Left' || e.keyCode === 37 || e.keyCode === 21;
  }
  function isRight(e) {
    return e.key === 'ArrowRight' || e.key === 'Right' || e.keyCode === 39 || e.keyCode === 22;
  }
  function isEnter(e) {
    return e.key === 'Enter' || e.key === 'Select' || e.key === 'Accept' || e.key === ' ' ||
           e.keyCode === 13 || e.keyCode === 23 || e.keyCode === 66 || e.keyCode === 29443 || e.keyCode === 32;
  }
  function isBack(e) {
    return e.key === 'Escape' || e.key === 'Backspace' || e.key === 'GoBack' || e.key === 'Back' ||
           e.keyCode === 27 || e.keyCode === 8 || e.keyCode === 4 || e.keyCode === 10009 || e.keyCode === 461;
  }

  // Establecer foco inicial en el botón principal de la portada (Hero Play)
  function setInitialFocus() {
    if (currentFocusedEl && document.body.contains(currentFocusedEl)) return;
    const defaultTarget = document.querySelector('.tv-hero-actions .tv-btn-primary') ||
                          document.querySelector('.tv-tab-btn.active') ||
                          document.querySelector('.tv-focusable');
    if (defaultTarget) {
      setTvFocus(defaultTarget, false);
    }
  }

  // Ejecutar establecimiento de foco inicial con reintentos
  setInitialFocus();
  setTimeout(setInitialFocus, 100);
  setTimeout(setInitialFocus, 300);
  setTimeout(setInitialFocus, 700);

  // Sincronizar automáticamente con el motor nativo de la Smart TV (focusin)
  document.addEventListener('focusin', (e) => {
    const target = e.target.closest('.tv-focusable');
    if (target && target !== currentFocusedEl) {
      setTvFocus(target, true, false);
    }
  });

  // Soporte para puntero/ratón (LG Magic Remote o mouse de Smart TV)
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('.tv-focusable');
    if (target && target !== currentFocusedEl) {
      setTvFocus(target, false, true);
    }
  });

  // Capturador principal de eventos del control remoto (Capture phase = true)
  window.addEventListener('keydown', (e) => {
    // Si no hay elemento enfocado, recuperar inmediatamente
    if (!currentFocusedEl || !document.body.contains(currentFocusedEl)) {
      setInitialFocus();
    }

    const playerModal = document.getElementById('tvPlayerModal');
    const qrModal = document.getElementById('tvQrModal');
    const isModalOpen = (playerModal && playerModal.classList.contains('active')) || 
                        (qrModal && qrModal.classList.contains('active'));

    // TECLA ATRÁS / BACK DEL CONTROL REMOTO
    if (isBack(e)) {
      if (isModalOpen) {
        e.preventDefault();
        e.stopPropagation();
        closeAllTvModals();
        playTvSound(320, 'triangle', 0.12);
        return;
      }
    }

    // TECLAS DIRECCIONALES (ARRIBA, ABAJO, IZQUIERDA, DERECHA)
    if (isUp(e) || isDown(e) || isLeft(e) || isRight(e)) {
      e.preventDefault();
      e.stopPropagation();

      let dir = '';
      if (isUp(e)) dir = 'up';
      else if (isDown(e)) dir = 'down';
      else if (isLeft(e)) dir = 'left';
      else if (isRight(e)) dir = 'right';

      navigateTv(dir);
      playTvSound(520, 'sine', 0.05);
      return;
    }

    // TECLA OK / ENTER / SELECCIONAR
    if (isEnter(e)) {
      if (currentFocusedEl) {
        e.preventDefault();
        e.stopPropagation();
        playTvSound(740, 'triangle', 0.14);
        currentFocusedEl.click();
      }
    }
  }, true);
}

// ===================================================================
// GESTOR DE FOCO Y DESPLAZAMIENTO VISUAL
// ===================================================================
function setTvFocus(element, shouldScroll = true, doNativeFocus = true) {
  if (!element) return;

  if (currentFocusedEl && currentFocusedEl !== element) {
    currentFocusedEl.classList.remove('tv-focused');
  }

  currentFocusedEl = element;
  currentFocusedEl.classList.add('tv-focused');

  if (doNativeFocus && document.activeElement !== element) {
    try {
      element.focus({ preventScroll: true });
    } catch (e) {
      element.focus();
    }
  }

  if (shouldScroll) {
    // Scroll horizontal si el elemento está en una fila o barra scrolleable
    const scroller = element.closest('.tv-row-scroller, .tv-nav-tabs-wrapper');
    if (scroller) {
      const cardRect = element.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const scrollOffset = (cardRect.left - scrollerRect.left) - (scrollerRect.width / 2) + (cardRect.width / 2);
      scroller.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }

    // Scroll vertical suave para mantener el elemento enfocado centrado en la pantalla
    const rect = element.getBoundingClientRect();
    const winHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < 90 || rect.bottom > winHeight - 90) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }
}

// ===================================================================
// MOTOR INTELIGENTE DE NAVEGACIÓN CONTEXTUAL Y ESPACIAL
// ===================================================================
function navigateTv(direction) {
  if (!currentFocusedEl) {
    const first = document.querySelector('.tv-hero-actions .tv-btn-primary') || document.querySelector('.tv-focusable');
    if (first) setTvFocus(first);
    return;
  }

  // 1. SI UN MODAL ESTÁ ABIERTO (Player o QR), NAVEGAR SOLO DENTRO DEL MODAL
  const activeModal = document.querySelector('.tv-player-modal.active, .tv-qr-modal.active');
  if (activeModal) {
    navigateInsideModal(activeModal, direction);
    return;
  }

  // 2. CONTEXTO A: DENTRO DE UNA FILA DE CONTENIDO (tv-row-scroller)
  const scroller = currentFocusedEl.closest('.tv-row-scroller');
  if (scroller) {
    if (direction === 'right') {
      const nextCard = currentFocusedEl.nextElementSibling;
      if (nextCard && nextCard.classList.contains('tv-focusable')) {
        setTvFocus(nextCard);
        return;
      }
    } else if (direction === 'left') {
      const prevCard = currentFocusedEl.previousElementSibling;
      if (prevCard && prevCard.classList.contains('tv-focusable')) {
        setTvFocus(prevCard);
        return;
      }
    } else if (direction === 'down') {
      // Ir a la siguiente fila de contenido
      const currentSection = currentFocusedEl.closest('.tv-row-section');
      const allSections = Array.from(document.querySelectorAll('.tv-row-section'));
      const currentIndex = allSections.indexOf(currentSection);

      if (currentIndex >= 0 && currentIndex < allSections.length - 1) {
        const nextSection = allSections[currentIndex + 1];
        focusClosestCardInRow(nextSection, currentFocusedEl);
        return;
      } else {
        // Si es la última fila, saltar al banner de descarga de APK
        const dlBtn = document.querySelector('#tvRowDownload .tv-download-btns .tv-btn-primary');
        if (dlBtn) {
          setTvFocus(dlBtn);
          return;
        }
      }
    } else if (direction === 'up') {
      // Ir a la fila anterior o subir al Hero Billboard
      const currentSection = currentFocusedEl.closest('.tv-row-section');
      const allSections = Array.from(document.querySelectorAll('.tv-row-section'));
      const currentIndex = allSections.indexOf(currentSection);

      if (currentIndex > 0) {
        const prevSection = allSections[currentIndex - 1];
        focusClosestCardInRow(prevSection, currentFocusedEl);
        return;
      } else {
        // Es la primera fila: subir a las acciones del Hero
        const heroBtn = document.querySelector('.tv-hero-actions .tv-btn-primary');
        if (heroBtn) {
          setTvFocus(heroBtn);
          return;
        }
      }
    }
  }

  // 3. CONTEXTO B: ACCIONES DEL HERO BILLBOARD
  const heroActions = currentFocusedEl.closest('.tv-hero-actions');
  if (heroActions) {
    const buttons = Array.from(heroActions.querySelectorAll('.tv-focusable'));
    const btnIndex = buttons.indexOf(currentFocusedEl);

    if (direction === 'right' && btnIndex < buttons.length - 1) {
      setTvFocus(buttons[btnIndex + 1]);
      return;
    } else if (direction === 'left' && btnIndex > 0) {
      setTvFocus(buttons[btnIndex - 1]);
      return;
    } else if (direction === 'down') {
      // Bajar a la primera tarjeta de la primera fila
      const firstCard = document.querySelector('#tvRowLive .tv-card');
      if (firstCard) {
        setTvFocus(firstCard);
        return;
      }
    } else if (direction === 'up') {
      // Subir a la pestaña de categorías activa
      const activeTab = document.querySelector('.tv-nav-tabs .tv-tab-btn.active') || document.querySelector('.tv-nav-tabs .tv-tab-btn');
      if (activeTab) {
        setTvFocus(activeTab);
        return;
      }
    }
  }

  // 4. CONTEXTO C: PESTAÑAS DE CATEGORÍAS (TABS)
  const tabsContainer = currentFocusedEl.closest('.tv-nav-tabs');
  if (tabsContainer) {
    const tabs = Array.from(tabsContainer.querySelectorAll('.tv-tab-btn'));
    const tabIndex = tabs.indexOf(currentFocusedEl);

    if (direction === 'right' && tabIndex < tabs.length - 1) {
      setTvFocus(tabs[tabIndex + 1]);
      return;
    } else if (direction === 'left' && tabIndex > 0) {
      setTvFocus(tabs[tabIndex - 1]);
      return;
    } else if (direction === 'down') {
      // Bajar a la acción principal del Hero
      const heroBtn = document.querySelector('.tv-hero-actions .tv-btn-primary');
      if (heroBtn) {
        setTvFocus(heroBtn);
        return;
      }
    } else if (direction === 'up') {
      // Subir al botón del Header (Modo PC / Móvil)
      const headerBtn = document.querySelector('.tv-header .tv-mode-exit-btn');
      if (headerBtn) {
        setTvFocus(headerBtn);
        return;
      }
    }
  }

  // 5. CONTEXTO D: HEADER SUPERIOR
  const header = currentFocusedEl.closest('.tv-header');
  if (header) {
    if (direction === 'down') {
      const activeTab = document.querySelector('.tv-nav-tabs .tv-tab-btn.active') || document.querySelector('.tv-nav-tabs .tv-tab-btn');
      if (activeTab) {
        setTvFocus(activeTab);
        return;
      }
    }
  }

  // 6. CONTEXTO E: BANNER DE DESCARGA DE APK (tvRowDownload)
  const downloadSection = currentFocusedEl.closest('#tvRowDownload');
  if (downloadSection) {
    const dlBtns = Array.from(downloadSection.querySelectorAll('.tv-focusable'));
    const dlIndex = dlBtns.indexOf(currentFocusedEl);

    if (direction === 'right' && dlIndex < dlBtns.length - 1) {
      setTvFocus(dlBtns[dlIndex + 1]);
      return;
    } else if (direction === 'left' && dlIndex > 0) {
      setTvFocus(dlBtns[dlIndex - 1]);
      return;
    } else if (direction === 'up') {
      // Subir a la última fila de contenido (Anime & Doramas)
      const lastSection = document.querySelector('#tvRowAnime');
      if (lastSection) {
        focusClosestCardInRow(lastSection, currentFocusedEl);
        return;
      }
    }
  }

  // 7. FALLBACK: NAVEGACIÓN ESPACIAL GEOMÉTRICA (2D EUCLIDIANA)
  navigateGeometric(direction);
}

// Navegar dentro de un modal abierto (Player o QR)
function navigateInsideModal(modal, direction) {
  const focusables = Array.from(modal.querySelectorAll('.tv-focusable')).filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  if (focusables.length === 0) return;

  const currentIndex = focusables.indexOf(currentFocusedEl);
  if (direction === 'right' || direction === 'down') {
    const next = focusables[(currentIndex + 1) % focusables.length];
    setTvFocus(next);
  } else if (direction === 'left' || direction === 'up') {
    const prev = focusables[(currentIndex - 1 + focusables.length) % focusables.length];
    setTvFocus(prev);
  }
}

// Encontrar la tarjeta en una fila cuya coordenada X coincida mejor con el elemento actual
function focusClosestCardInRow(section, sourceElement) {
  const cards = Array.from(section.querySelectorAll('.tv-card'));
  if (cards.length === 0) return;

  const srcRect = sourceElement.getBoundingClientRect();
  const srcCenterX = srcRect.left + srcRect.width / 2;

  let bestCard = cards[0];
  let minDiff = Infinity;

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const diff = Math.abs(centerX - srcCenterX);
    if (diff < minDiff) {
      minDiff = diff;
      bestCard = card;
    }
  });

  setTvFocus(bestCard);
}

// Algoritmo espacial general cuando no hay relación contextual directa
function navigateGeometric(direction) {
  const candidates = Array.from(document.querySelectorAll('.tv-app-wrapper .tv-focusable')).filter(el => {
    if (el === currentFocusedEl) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
  });

  if (candidates.length === 0) return;

  const currentRect = currentFocusedEl.getBoundingClientRect();
  const currentCenter = {
    x: currentRect.left + currentRect.width / 2,
    y: currentRect.top + currentRect.height / 2
  };

  let bestCandidate = null;
  let bestScore = Infinity;

  candidates.forEach(candidate => {
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
        isDirectionValid = dx < -15;
        primaryDist = Math.abs(dx);
        secondaryDist = Math.abs(dy);
        break;
      case 'right':
        isDirectionValid = dx > 15;
        primaryDist = Math.abs(dx);
        secondaryDist = Math.abs(dy);
        break;
      case 'up':
        isDirectionValid = dy < -15;
        primaryDist = Math.abs(dy);
        secondaryDist = Math.abs(dx);
        break;
      case 'down':
        isDirectionValid = dy > 15;
        primaryDist = Math.abs(dy);
        secondaryDist = Math.abs(dx);
        break;
    }

    if (isDirectionValid) {
      const score = primaryDist + (secondaryDist * 2.2);
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
            setTimeout(() => setTvFocus(firstCard), 350);
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
  modal.setAttribute('aria-hidden', 'false');

  const closeBtn = document.getElementById('tvPlayerCloseBtn');
  if (closeBtn) {
    setTimeout(() => setTvFocus(closeBtn), 150);
  }
}

window.openTvPlayer = openTvPlayer;

function closeAllTvModals() {
  document.querySelectorAll('.tv-player-modal, .tv-qr-modal').forEach(m => {
    m.classList.remove('active');
    m.setAttribute('aria-hidden', 'true');
  });

  // Devolver el foco a la portada o botón activo
  const heroBtn = document.querySelector('.tv-hero-actions .tv-btn-primary') || document.querySelector('.tv-focusable');
  if (heroBtn) {
    setTimeout(() => setTvFocus(heroBtn), 150);
  }
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

  const directLink = document.getElementById('tvWhatsappDirectBtn');
  if (directLink) {
    directLink.href = whatsappUrl;
  }

  const qrImg = document.getElementById('tvQrCodeImg');
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(whatsappUrl)}&color=090511&bgcolor=ffffff`;
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');

  const qrCloseBtn = document.getElementById('tvQrCloseBtn');
  if (qrCloseBtn) {
    setTimeout(() => setTvFocus(qrCloseBtn), 150);
  }
}

window.openTvVipModal = openTvVipModal;

// ===================================================================
// DESCARGA DIRECTA DE APK TV (DESDE NAVEGADOR ANDROID TV O FIRESTICK)
// ===================================================================
function downloadTvApk(apkName = 'velox_play_tv.apk') {
  playTvSound(880, 'triangle', 0.2);

  // Soporte directo para navegadores de TV
  const downloadLink = document.createElement('a');
  downloadLink.href = `apks/${apkName}`;
  downloadLink.setAttribute('download', apkName);
  downloadLink.target = '_blank';
  document.body.appendChild(downloadLink);
  downloadLink.click();

  setTimeout(() => {
    if (downloadLink.parentNode) {
      downloadLink.parentNode.removeChild(downloadLink);
    }
  }, 400);

  // Fallback directo por si el navegador bloquea la creación dinámica
  setTimeout(() => {
    window.location.href = `apks/${apkName}`;
  }, 100);

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
      font-size: 1.15rem;
      padding: 16px 32px;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.85), 0 0 25px rgba(255, 117, 24, 0.6);
      z-index: 3000;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3500);
}

window.showTvToast = showTvToast;
