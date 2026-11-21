/* Draggable floating WhatsApp button — works with touch and mouse.
   Position is remembered across pages. A tap still opens WhatsApp. */
(function () {
  var btn = document.querySelector('.floating-whatsapp');
  if (!btn) return;
  var KEY = 'ss_wa_pos_v1';
  var SIZE = 54, MARGIN = 8, THRESH = 6;
  btn.style.touchAction = 'none';
  btn.style.cursor = 'grab';
  btn.style.userSelect = 'none';
  btn.setAttribute('draggable', 'false');

  function clamp(x, y) {
    var maxX = window.innerWidth - SIZE - MARGIN;
    var maxY = window.innerHeight - SIZE - MARGIN;
    return { x: Math.min(Math.max(MARGIN, x), Math.max(MARGIN, maxX)),
             y: Math.min(Math.max(MARGIN, y), Math.max(MARGIN, maxY)) };
  }
  function place(x, y) {
    var p = clamp(x, y);
    btn.style.left = p.x + 'px';
    btn.style.top = p.y + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
    return p;
  }
  try {
    var saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved.x === 'number') place(saved.x, saved.y);
  } catch (e) {}

  var startX, startY, originX, originY, dragging = false, moved = false, pid = null;

  btn.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var r = btn.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    originX = r.left; originY = r.top;
    dragging = true; moved = false; pid = e.pointerId;
    try { btn.setPointerCapture(pid); } catch (err) {}
  });
  btn.addEventListener('pointermove', function (e) {
    if (!dragging || e.pointerId !== pid) return;
    var dx = e.clientX - startX, dy = e.clientY - startY;
    if (!moved && Math.abs(dx) + Math.abs(dy) < THRESH) return;
    moved = true;
    btn.style.cursor = 'grabbing';
    btn.style.transition = 'none';
    place(originX + dx, originY + dy);
    e.preventDefault();
  });
  function end(e) {
    if (!dragging || (e && e.pointerId !== pid)) return;
    dragging = false;
    btn.style.cursor = 'grab';
    try { btn.releasePointerCapture(pid); } catch (err) {}
    if (moved) {
      var r = btn.getBoundingClientRect();
      // snap to nearest side edge
      var x = (r.left + SIZE / 2 < window.innerWidth / 2) ? MARGIN : window.innerWidth - SIZE - MARGIN;
      btn.style.transition = 'left .2s ease';
      var p = place(x, r.top);
      try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (err) {}
    }
  }
  btn.addEventListener('pointerup', end);
  btn.addEventListener('pointercancel', end);
  // Block the link opening right after a drag
  btn.addEventListener('click', function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);
  window.addEventListener('resize', function () {
    var r = btn.getBoundingClientRect();
    if (btn.style.left) place(r.left, r.top);
  });
})();
