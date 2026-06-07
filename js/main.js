/* ═══════════════════════════════════════════
   PORTFOLIO — SHARED JS
═══════════════════════════════════════════ */

// ── PAGE TRANSITION ──────────────────────────
// Wraps all internal nav links with a quick flash-out before navigating
function initTransitions() {
  const overlay = document.getElementById('transition-overlay');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only intercept internal links (not anchors, not external)
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('flash');
      setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });

  // Fade in on page load
  overlay.classList.remove('flash');
}

// ── MOBILE NAV ───────────────────────────────
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-links');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Close' : 'Menu';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      toggle.textContent = 'Menu';
    });
  });
}

// ── ACTIVE NAV LINK ──────────────────────────
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === current) link.classList.add('active');
  });
}

// ── SCROLL REVEAL ────────────────────────────
function initReveal() {
  // Case study pages opt out — text stays still, shadows animate instead
  if (document.body.classList.contains('case-page')) return;

  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger reveal by index
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => obs.observe(el));
}

// ── STAT BAR ANIMATION ───────────────────────
function initStatBars() {
  const groups = document.querySelectorAll('.char-stats, .about-skills');
  if (!groups.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-bar-fill').forEach((bar, i) => {
          const target = bar.dataset.width || bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => { bar.style.width = target; }, i * 120 + 100);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  groups.forEach(g => obs.observe(g));
}

// ── FOOTER YEAR ──────────────────────────────
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ── WAND CURSOR + SPARKLES ───────────────────
function initWand() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  // Inject canvas and wand into the page
  const canvas = document.createElement('canvas');
  canvas.id = 'sparkle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const wand = document.createElement('div');
  wand.id = 'wand-cursor';
  wand.setAttribute('aria-hidden', 'true');
  wand.innerHTML = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <polygon points="6,0 7.5,4.5 12,4.5 8.5,7 10,12 6,9 2,12 3.5,7 0,4.5 4.5,4.5"
      fill="#E3E0E9" stroke="#7C58A5" stroke-width="0.5"/>
    <line x1="8" y1="10" x2="28" y2="30" stroke="#D0B6D0" stroke-width="3" stroke-linecap="round"/>
    <line x1="20" y1="22" x2="23" y2="25" stroke="#7C58A5" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    <line x1="23" y1="25" x2="26" y2="28" stroke="#7C58A5" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  </svg>`;
  document.body.appendChild(wand);

  const ctx = canvas.getContext('2d');
  const PALETTE       = ['#FF6B6B','#7C58A5','#D0B6D0','#E3E0E9','#ff9999','#fff'];
  const SPARKLE_CHARS = ['✦','✧','⋆','✺','⊹'];
  const MAX_SPARKLES  = 20;
  let sparkles  = [];
  let moveCount = 0;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    wand.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`;
    moveCount++;
    if (moveCount % 3 === 0) spawn(e.clientX, e.clientY, false);
  });

  document.addEventListener('click', e => {
    wand.classList.add('wand-click');
    setTimeout(() => wand.classList.remove('wand-click'), 400);
    for (let i = 0; i < 8; i++) spawn(e.clientX, e.clientY, true);
  });

  function spawn(x, y, burst) {
    if (sparkles.length >= MAX_SPARKLES) return;
    const a   = burst ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * 1.4;
    const spd = burst ? 1.8 + Math.random() * 2.8   : 0.4 + Math.random() * 0.9;
    sparkles.push({
      x, y,
      vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 1.4,
      char:  SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      size:  9 + Math.random() * 10,
      life:  0.5 + Math.random() * 0.45, age: 0,
      rot:   Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.13,
    });
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparkles = sparkles.filter(s => s.age < s.life);
    sparkles.forEach(s => {
      s.age += dt; s.x += s.vx; s.y += s.vy;
      s.vy -= 0.04; s.rot += s.spin;
      ctx.save();
      ctx.globalAlpha = (1 - s.age / s.life) * 0.88;
      ctx.translate(s.x, s.y); ctx.rotate(s.rot);
      ctx.font = `${s.size}px serif`;
      ctx.fillStyle = s.color;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(s.char, 0, 0);
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── INIT ALL ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTransitions();
  initNav();
  initActiveNav();
  initReveal();
  initStatBars();
  initYear();
  initWand();
});
