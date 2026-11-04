/* Abdelrahman Hesham: portfolio */

/* ==========================================================
   SETTINGS
   To receive the form by email without a server:
   1. Go to https://web3forms.com, enter your email, and copy the access key.
   2. Paste it between the quotes below.
   Until then, the form opens the visitor's email app with the request filled in.
   ========================================================== */
var WEB3FORMS_KEY = '';
var CONTACT_EMAIL = 'eng.ae.hesham@gmail.com';


/* ---------- Language (English / Arabic) ---------- */
var STRINGS = {
  en: {
    chosen: 'Request type: ',
    sending: 'Sending…',
    sent: 'Thank you. Your request was sent and I will reply by email.',
    failed: 'The request could not be sent. Please email me at ',
    mailto: 'Your email app should open with the request filled in. If it does not, write to ',
    switchLabel: 'Switch language to Arabic',
    button: 'عربي',
    placeholders: {
      project: 'What should the board do? Any limits on size, power or interfaces?',
      full: 'What is the product, who is it for, and what should it do?',
      automation: 'What should be controlled, and where is the site?',
      consult: 'What would you like help with? Describe the board or circuit and the problem.',
      job: 'Tell me about the role and the team.',
      grant: 'Tell me about the program or the collaboration.',
      other: 'How can I help?',
      none: 'Tell me what you need.'
    }
  },
  ar: {
    chosen: 'نوع الطلب: ',
    sending: 'جارٍ الإرسال…',
    sent: 'شكرًا لك. تم إرسال طلبك وسأرد عليك بالبريد الإلكتروني.',
    failed: 'تعذّر إرسال الطلب. من فضلك راسلني على ',
    mailto: 'يجب أن يُفتح تطبيق البريد وبه الطلب جاهزًا. إن لم يُفتح، راسلني على ',
    switchLabel: 'Switch language to English',
    button: 'EN',
    placeholders: {
      project: 'ماذا يجب أن تفعل اللوحة؟ وهل هناك قيود على الحجم أو الطاقة أو الواجهات؟',
      full: 'ما المنتج، ولمن هو، وماذا يجب أن يفعل؟',
      automation: 'ما الذي يجب التحكم فيه، وأين الموقع؟',
      consult: 'بماذا تريد المساعدة؟ صف اللوحة أو الدائرة والمشكلة.',
      job: 'أخبرني عن الوظيفة والفريق.',
      grant: 'أخبرني عن البرنامج أو التعاون المقترح.',
      other: 'كيف أستطيع مساعدتك؟',
      none: 'أخبرني بما تحتاجه.'
    }
  }
};

var currentLang = 'en';

function applyLang(lang) {
  currentLang = lang === 'ar' ? 'ar' : 'en';
  var root = document.documentElement;
  root.lang = currentLang;
  root.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  // Text content
  document.querySelectorAll('[data-ar]').forEach(function (el) {
    if (el.dataset.en === undefined) el.dataset.en = el.textContent;
    el.textContent = currentLang === 'ar' ? el.getAttribute('data-ar') : el.dataset.en;
  });

  // Attributes: data-ar-alt, data-ar-aria-label, data-ar-placeholder, data-ar-content
  document.querySelectorAll('*').forEach(function (el) {
    for (var i = 0; i < el.attributes.length; i++) {
      var name = el.attributes[i].name;
      if (name.indexOf('data-ar-') !== 0) continue;
      var target = name.slice(8);
      var store = 'data-en-' + target;
      if (!el.hasAttribute(store)) el.setAttribute(store, el.getAttribute(target) || '');
      el.setAttribute(target, currentLang === 'ar' ? el.getAttribute(name) : el.getAttribute(store));
    }
  });

  var toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.textContent = STRINGS[currentLang].button;
    toggle.setAttribute('aria-label', STRINGS[currentLang].switchLabel);
    toggle.setAttribute('lang', currentLang === 'ar' ? 'en' : 'ar');
  }

  updateRequestType(false);
  try { localStorage.setItem('lang', currentLang); } catch (e) {}
}

function initialLang() {
  var fromUrl = /[?&]lang=(ar|en)\b/.exec(location.search);
  if (fromUrl) return fromUrl[1];
  try {
    var saved = localStorage.getItem('lang');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch (e) {}
  return (navigator.language || '').toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en';
}


/* ---------- Request form ---------- */
var form = document.getElementById('request-form');
var typeSelect = document.getElementById('f-type');
var chosen = document.getElementById('chosen');
var statusEl = document.getElementById('status');
var messageEl = document.getElementById('f-message');

function selectedTypeLabel() {
  var opt = typeSelect && typeSelect.options[typeSelect.selectedIndex];
  return opt && opt.value ? opt.textContent : '';
}

function updateRequestType() {
  if (!form || !typeSelect) return;
  var type = typeSelect.value;

  form.querySelectorAll('.extra').forEach(function (group) {
    var show = type && group.getAttribute('data-for').split(' ').indexOf(type) !== -1;
    group.hidden = !show;
    // Hidden questions are neither validated nor sent
    group.querySelectorAll('input, select, textarea').forEach(function (f) { f.disabled = !show; });
  });

  var label = selectedTypeLabel();
  chosen.hidden = !label;
  chosen.textContent = label ? STRINGS[currentLang].chosen + label : '';

  var ph = STRINGS[currentLang].placeholders;
  messageEl.setAttribute('placeholder', ph[type] || ph.none);
}

if (typeSelect) typeSelect.addEventListener('change', updateRequestType);

document.querySelectorAll('[data-request]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    typeSelect.value = btn.getAttribute('data-request');
    updateRequestType();
    statusEl.textContent = '';
    statusEl.classList.remove('is-error');
    var target = document.getElementById('contact');
    target.scrollIntoView();
    var first = document.getElementById('f-name');
    if (first) first.focus({ preventScroll: true });
  });
});

function collectFields() {
  var data = new FormData(form);
  var out = {};
  data.forEach(function (value, key) {
    if (key === 'botcheck') return;
    if (out[key] !== undefined) out[key] += ', ' + value;
    else out[key] = String(value);
  });
  out.type_label = selectedTypeLabel() || (typeSelect.value || '');
  return out;
}

function setStatus(text, isError, html) {
  statusEl.classList.toggle('is-error', !!isError);
  if (html) statusEl.innerHTML = html; else statusEl.textContent = text;
}

function mailtoFallback(fields) {
  var lines = [];
  Object.keys(fields).forEach(function (k) {
    if (k === 'message' || k === 'type_label') return;
    lines.push(k + ': ' + fields[k]);
  });
  var body = 'Request type: ' + fields.type_label + '\n' + lines.join('\n') + '\n\n' + (fields.message || '');
  var subject = 'Portfolio request: ' + fields.type_label;
  location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.querySelector('[name="botcheck"]').value) return;   // a bot filled the trap
    if (!form.reportValidity()) return;

    var fields = collectFields();
    var send = document.getElementById('send');

    if (!WEB3FORMS_KEY) {
      setStatus(STRINGS[currentLang].mailto + CONTACT_EMAIL + '.', false);
      mailtoFallback(fields);
      return;
    }

    var payload = {};
    Object.keys(fields).forEach(function (k) { payload[k] = fields[k]; });
    payload.access_key = WEB3FORMS_KEY;
    payload.subject = 'Portfolio request: ' + fields.type_label;
    payload.from_name = 'Portfolio website';

    send.disabled = true;
    setStatus(STRINGS[currentLang].sending, false);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().then(function (j) { return { ok: res.ok && j.success, json: j }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error('rejected');
        form.reset();
        updateRequestType();
        setStatus(STRINGS[currentLang].sent, false);
      })
      .catch(function () {
        setStatus('', true, STRINGS[currentLang].failed + '<a href="mailto:' + CONTACT_EMAIL + '" dir="ltr">' + CONTACT_EMAIL + '</a>.');
      })
      .then(function () { send.disabled = false; });
  });
}


/* ---------- Language toggle ---------- */
var langToggle = document.getElementById('lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', function () {
    applyLang(currentLang === 'ar' ? 'en' : 'ar');
  });
}
applyLang(initialLang());


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
    slider.setAttribute('aria-valuetext', duty + ' / ' + vout);
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

  var visible = false;
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
  } else {
    visible = true;
  }
  requestAnimationFrame(frame);
})();


/* ---------- Optional photos ----------
   If an image file is missing or blocked, its figure is removed,
   so the page never shows a broken-image icon. */
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
