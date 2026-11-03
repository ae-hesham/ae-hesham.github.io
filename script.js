/* Abdelrahman Hesham: portfolio */

/* ---------- Buck converter scope ---------- */
(function () {
  var sw = document.getElementById('sw-trace');
  var il = document.getElementById('il-trace');
  var slider = document.getElementById('duty');
  var preset = document.getElementById('preset');
  var outDuty = document.getElementById('out-duty');
  var outVout = document.getElementById('out-vout');
  var outRipple = document.getElementById('out-ripple');
  var svg = document.getElementById('scope-svg');
  if (!sw || !il || !slider) return;

  // Ideal buck model, for illustration
  var VIN = 12;       // volts
  var L = 22e-6;      // henries
  var F = 500e3;      // hertz
  var ILOAD = 1;      // amps

  var W = 640;
  var PERIOD_PX = 112;       // one switching period on screen
  var SW_HIGH = 52, SW_LOW = 132;
  var IL_CENTER = 270, IL_SCALE = 220;   // pixels per amp

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phase = 0;

  function model() {
    var d = parseFloat(slider.value) / 100;
    var vout = d * VIN;
    var ripple = (VIN - vout) * d / (L * F);
    return { d: d, vout: vout, ripple: ripple };
  }

  function draw() {
    var m = model();
    var offset = phase % PERIOD_PX;
    var iMin = IL_CENTER + (m.ripple / 2) * IL_SCALE;   // lower current = lower on screen
    var iMax = IL_CENTER - (m.ripple / 2) * IL_SCALE;
    var swPts = [];
    var ilPts = [];
    var n = Math.ceil(W / PERIOD_PX) + 2;

    for (var k = -1; k < n; k++) {
      var x0 = k * PERIOD_PX - offset;
      var xOn = x0 + m.d * PERIOD_PX;
      swPts.push(x0 + ',' + SW_LOW, x0 + ',' + SW_HIGH, xOn + ',' + SW_HIGH, xOn + ',' + SW_LOW);
      ilPts.push(x0 + ',' + iMin, xOn + ',' + iMax);
    }
    ilPts.push((n * PERIOD_PX - offset) + ',' + iMin);

    sw.setAttribute('points', swPts.join(' '));
    il.setAttribute('points', ilPts.join(' '));
  }

  function readouts() {
    var m = model();
    var duty = (m.d * 100).toFixed(1) + '%';
    var vout = m.vout.toFixed(2) + ' V';
    outDuty.textContent = duty;
    outVout.textContent = vout;
    outRipple.textContent = m.ripple.toFixed(2) + ' A';
    slider.setAttribute('aria-valuetext', duty + ' duty cycle, ' + vout + ' output');
  }

  function update() {
    readouts();
    draw();
  }

  slider.addEventListener('input', update);
  preset.addEventListener('click', function () {
    slider.value = (5 / VIN * 100).toFixed(1);   // 41.7%
    update();
  });

  update();

  // Slowly scroll the trace like a live scope, only while it is on screen
  if (reduceMotion) return;

  var visible = true;
  var last = null;
  var SPEED = 36;   // pixels per second

  function frame(t) {
    if (last === null) last = t;
    var dt = Math.min((t - last) / 1000, 0.1);
    last = t;
    if (visible && !document.hidden) {
      phase += dt * SPEED;
      draw();
    }
    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }).observe(svg);
  }
  requestAnimationFrame(frame);
})();

/* ---------- Optional photos ----------
   Photos are optional. If an image file is missing, its figure is removed,
   so the page never shows a broken-image icon. Add the file and it appears. */
(function () {
  function drop(fig) {
    var group = fig.parentElement;
    fig.remove();
    if (group && group.classList.contains('photos') && !group.querySelector('figure')) {
      group.remove();
    }
  }
  document.querySelectorAll('figure[data-optional]').forEach(function (fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    if (img.complete && img.naturalWidth === 0) {
      drop(fig);
    } else {
      img.addEventListener('error', function () { drop(fig); }, { once: true });
    }
  });
})();
