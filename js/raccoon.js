/* ═══════════════════════════════════════════
   MAGIC WAND CURSOR + SPARKLE TRAIL
═══════════════════════════════════════════ */
(function () {
  'use strict';

  const PALETTE       = ['#FF6B6B', '#7C58A5', '#D0B6D0', '#E3E0E9', '#ff9999', '#ffffff'];
  const SPARKLE_CHARS = ['✦', '✧', '⋆', '✺', '⊹'];
  const MAX_SPARKLES  = 18;
  const SPAWN_EVERY   = 3;

  const wand   = document.getElementById('wand-cursor');
  const canvas = document.getElementById('sparkle-canvas');
  if (!wand || !canvas) return;

  const ctx = canvas.getContext('2d');
  let sparkles  = [];
  let moveCount = 0;
  let rafId;

  /* ── CANVAS SIZE ──────────────────────── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── MOVE WAND ────────────────────────── */
  document.addEventListener('mousemove', function (e) {
    var x = e.clientX - 4;
    var y = e.clientY - 4;
    wand.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    wand.style.setProperty('--wx', x + 'px');
    wand.style.setProperty('--wy', y + 'px');

    moveCount++;
    if (moveCount % SPAWN_EVERY === 0) spawnSparkle(e.clientX, e.clientY);
  }, { passive: true });

  /* ── CLICK BURST ──────────────────────── */
  document.addEventListener('click', function (e) {
    wand.classList.add('wand-click');
    setTimeout(function () { wand.classList.remove('wand-click'); }, 400);
    for (var i = 0; i < 7; i++) spawnSparkle(e.clientX, e.clientY, true);
  });

  /* ── SPAWN ────────────────────────────── */
  function spawnSparkle(x, y, burst) {
    if (sparkles.length >= MAX_SPARKLES) return;
    var angle = burst
      ? Math.random() * Math.PI * 2
      : (Math.random() - 0.5) * 1.2;
    var speed = burst ? 1.5 + Math.random() * 2.5 : 0.4 + Math.random() * 0.8;
    sparkles.push({
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.2,
      char:  SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      size:  9 + Math.random() * 9,
      alpha: 1,
      life:  0.5 + Math.random() * 0.4,
      age:   0,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.12
    });
  }

  /* ── LOOP ─────────────────────────────── */
  var last = performance.now();
  function tick(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparkles = sparkles.filter(function (s) { return s.age < s.life; });

    for (var i = 0; i < sparkles.length; i++) {
      var s = sparkles[i];
      s.age += dt;
      s.x  += s.vx;
      s.y  += s.vy;
      s.vy -= 0.03;
      s.rotation += s.spin;
      s.alpha = 1 - (s.age / s.life);

      ctx.save();
      ctx.globalAlpha = s.alpha * 0.85;
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.font = s.size + 'px serif';
      ctx.fillStyle = s.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.char, 0, 0);
      ctx.restore();
    }

    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  });

})();
