/**
 * Cinemax Plus (Velox Play) v7.3.2 - Main Application Logic
 * Language: JavaScript ES6+ Vanilla
 */

document.addEventListener('DOMContentLoaded', () => {
  initUserAgentDetection();
  initVersionFetcher();
  initFAQAccordion();
  initTabSwitchers();
  initModals();
  initMobileMenu();
  initTVKeyboardNavigation();
  initVIPFormHandler();
});

/**
 * 1. User-Agent Simulator & Architecture Recommendation Engine
 */
function initUserAgentDetection() {
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  
  let recommendedArch = 'arm64';
  let deviceType = 'Celular / Tablet (Android)';
  let archBadgeText = 'Recomendado para tu dispositivo';

  // Detect 64-bit vs 32-bit vs x86 vs TV
  if (ua.includes('googletv') || ua.includes('aftb') || ua.includes('aftm') || ua.includes('smarttv') || ua.includes('androidtv') || ua.includes('crkey')) {
    recommendedArch = 'arm64';
    deviceType = 'Smart TV / FireStick';
    archBadgeText = '🎯 Ideal para tu Smart TV';
  } else if (ua.includes('x86_64') || ua.includes('x86') || platform.includes('win') || platform.includes('mac') || platform.includes('linux')) {
    recommendedArch = 'x86';
    deviceType = 'Emulador PC / TV Box X86';
    archBadgeText = '💻 Detectado Entorno PC / Emulador';
  } else if (ua.includes('armv7') || ua.includes('armv6') || ua.includes('i686')) {
    recommendedArch = 'arm32';
    deviceType = 'Dispositivo 32-bit (Gama Entrada)';
    archBadgeText = '⚡ Recomendado para 32-bit';
  } else {
    // Default to arm64 for modern devices
    recommendedArch = 'arm64';
    deviceType = 'Android Moderno (ARM64)';
    archBadgeText = '🚀 Recomendación Automática';
  }

  // Update DOM UI elements
  const userDeviceBadge = document.getElementById('user-device-detected');
  if (userDeviceBadge) {
    userDeviceBadge.innerHTML = `<i class="fa-solid fa-microchip text-brand-purple"></i> Sistema detectado: <strong class="text-white">${deviceType}</strong>`;
  }

  // Highlight recommended download card
  const archCards = document.querySelectorAll('.download-arch-card');
  archCards.forEach(card => {
    const arch = card.getAttribute('data-arch');
    if (arch === recommendedArch) {
      card.classList.add('border-brand-purple', 'glow-purple', 'ring-2', 'ring-purple-500/50');
      const badge = card.querySelector('.arch-recommendation-badge');
      if (badge) {
        badge.classList.remove('hidden');
        badge.textContent = archBadgeText;
      }
    }
  });
}

/**
 * 2. Asynchronous Version Checker from version.json
 */
async function initVersionFetcher() {
  try {
    const response = await fetch('version.json?t=' + Date.now());
    if (!response.ok) throw new Error('HTTP status ' + response.status);
    const data = await response.json();

    // Update dynamic version strings across UI
    const versionBadges = document.querySelectorAll('.app-version-str');
    versionBadges.forEach(el => {
      el.textContent = `v${data.version} (Build ${data.build_number})`;
    });

    const arm64Size = document.getElementById('size-arm64');
    if (arm64Size && data.file_sizes) arm64Size.textContent = data.file_sizes.arm64;

    const arm32Size = document.getElementById('size-arm32');
    if (arm32Size && data.file_sizes) arm32Size.textContent = data.file_sizes.arm32;

    const x86Size = document.getElementById('size-x86');
    if (x86Size && data.file_sizes) x86Size.textContent = data.file_sizes.x86;

  } catch (err) {
    console.warn('Simulador de version.json ejecutando datos por defecto local:', err);
  }
}

/**
 * 3. FAQ Accordion Toggle
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherContent = other.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        // Toggle clicked item
        if (!isActive) {
          item.classList.add('active');
          const content = item.querySelector('.faq-content');
          if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }
      });
    }
  });
}

/**
 * 4. Tab Switchers (Free vs VIP & Content Showcase)
 */
function initTabSwitchers() {
  const tabButtons = document.querySelectorAll('[data-tab-group]');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-tab-group');
      const targetId = btn.getAttribute('data-tab-target');

      // Deactivate all buttons in group
      document.querySelectorAll(`[data-tab-group="${group}"]`).forEach(b => {
        b.classList.remove('active');
      });

      // Activate current button
      btn.classList.add('active');

      // Hide all panels in group
      document.querySelectorAll(`[data-tab-panel-group="${group}"]`).forEach(panel => {
        panel.classList.add('hidden');
      });

      // Show target panel
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.remove('hidden');
      }
    });
  });
}

/**
 * 5. Native HTML Dialog Modals
 */
function initModals() {
  // Generic modal triggers
  const modalOpeners = document.querySelectorAll('[data-modal-open]');
  const modalClosers = document.querySelectorAll('[data-modal-close]');

  modalOpeners.forEach(opener => {
    opener.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = opener.getAttribute('data-modal-open');
      const dialog = document.getElementById(modalId);
      if (dialog && typeof dialog.showModal === 'function') {
        // Pre-fill plan if passed
        const planAttr = opener.getAttribute('data-plan-name');
        if (planAttr) {
          const planInput = dialog.querySelector('input[name="plan"]');
          if (planInput) planInput.value = planAttr;
          const planTitle = dialog.querySelector('.modal-plan-title');
          if (planTitle) planTitle.textContent = planAttr;
        }
        dialog.showModal();
      }
    });
  });

  modalClosers.forEach(closer => {
    closer.addEventListener('click', () => {
      const dialog = closer.closest('dialog');
      if (dialog && typeof dialog.close === 'function') {
        dialog.close();
      }
    });
  });

  // Close dialog on backdrop click
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        dialog.close();
      }
    });
  });
}

/**
 * 6. Responsive Mobile Navigation Menu
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('translate-x-full');
    });
  }

  if (closeBtn && mobileDrawer) {
    closeBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('translate-x-full');
    });
  }

  // Close drawer on link click
  const drawerLinks = document.querySelectorAll('#mobile-drawer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.add('translate-x-full');
    });
  });
}

/**
 * 7. Smart TV Keyboard Navigation (D-Pad Navigation Simulation for TV Focusable)
 */
function initTVKeyboardNavigation() {
  const focusables = Array.from(document.querySelectorAll('.tv-focusable, a, button, input, select'));
  let currentIndex = -1;

  document.addEventListener('keydown', (e) => {
    // Only capture Arrow keys if TV Mode active or user presses arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const activeEl = document.activeElement;
      let nextIndex = focusables.indexOf(activeEl);

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextIndex = (nextIndex + 1) % focusables.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        nextIndex = (nextIndex - 1 + focusables.length) % focusables.length;
      }

      if (focusables[nextIndex]) {
        focusables[nextIndex].focus();
        // Option to prevent scrolling if focus is managed
      }
    }
  });
}

/**
 * 8. VIP Form Submission to process.php & WhatsApp Link Generator
 */
function initVIPFormHandler() {
  const form = document.getElementById('vip-contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Enviar';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Procesando...';
    }

    const formData = new FormData(form);

    try {
      const response = await fetch('process.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.status === 'success' && result.redirect_url) {
        window.open(result.redirect_url, '_blank');
        const dialog = form.closest('dialog');
        if (dialog) dialog.close();
      } else {
        alert(result.message || 'Error al procesar la solicitud.');
      }
    } catch (err) {
      // Fallback direct WhatsApp redirect if PHP server not present
      const name = formData.get('name') || 'Usuario';
      const plan = formData.get('plan') || 'Pase VIP Gold';
      const device = formData.get('device') || 'Android / Smart TV';
      const note = formData.get('note') || 'Deseo información de compra';

      const fallbackMsg = encodeURIComponent(
        `🍿 *SOLICITUD VIP GOLD — CINEMAX PLUS (VELOX PLAY)* 🍿\n\n` +
        `👤 *Cliente:* ${name}\n` +
        `💎 *Plan:* ${plan}\n` +
        `📱 *Dispositivo:* ${device}\n` +
        `📝 *Nota:* ${note}`
      );
      window.open(`https://api.whatsapp.com/send?phone=525616840524&text=${fallbackMsg}`, '_blank');
      const dialog = form.closest('dialog');
      if (dialog) dialog.close();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

/**
 * Direct Helper to Open WhatsApp with specific plan
 */
function requestVIPPlan(planName) {
  const msg = encodeURIComponent(
    `🍿 *DESEO ADQUIRIR EL PASE VIP GOLD (${planName.toUpperCase()})* 🍿\n\n` +
    `Hola, me interesa activar mi suscripción de *Cinemax Plus (Velox Play) v7.3.2*.\n` +
    `Por favor envíenme los datos de transferencia bancaria (CLABE) / método de pago.`
  );
  window.open(`https://api.whatsapp.com/send?phone=525616840524&text=${msg}`, '_blank');
}
