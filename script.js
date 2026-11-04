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
    sent: 'Your request has been received. I will review it and reply by email.',
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
    sent: 'تم استلام طلبك. سأراجعه وأردّ عليك عبر البريد الإلكتروني.',
    failed: 'تعذّر إرسال الطلب. من فضلك راسلني على ',
    mailto: 'يجب أن يُفتح تطبيق البريد وبه الطلب جاهزًا. إن لم يُفتح، راسلني على ',
    switchLabel: 'Switch language to English',
    button: 'English',
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

var PROJECT_FORM_URL = 'project-inquiry.html';
var EMPLOYMENT_FORM_URL = 'employment-opportunity.html';

['en', 'ar'].forEach(function (l) {
  var p = STRINGS[l].placeholders;
  p.pcb = p.project; p.enquiry = p.full; p.collab = p.grant; p.general = p.other;
  p.embedded = l === 'en' ? 'What should the firmware do, and on which microcontroller or interfaces?' : 'ماذا يجب أن تفعل البرمجة (Firmware)، وعلى أي متحكم أو واجهات؟';
});

var NOTICES = {
  en: {
    project: { text: ['For project work, the detailed Project Inquiry Form is the better route. It captures requirements, scope, constraints and timeline, so my reply can be a specific technical assessment rather than a general response.', 'A short message here is also welcome.'], cta: 'Open the Project Inquiry Form' },
    job: { text: ['This channel is for companies, employers and recruiters who wish to discuss a role, contract or engagement with me.', 'It is not a job-application form for candidates.'], cta: 'Offer an Opportunity' }
  },
  ar: {
    project: { text: ['لمشاريع التصميم والتطوير، يُنصح باستخدام نموذج طلب المشروع التفصيلي؛ فهو يوثّق المتطلبات ونطاق العمل والقيود والجدول الزمني، فيأتي ردي تقييمًا فنيًا محددًا لا ردًا عامًا.', 'ويمكنك أيضًا إرسال رسالة مختصرة من هنا.'], cta: 'افتح نموذج طلب المشروع' },
    job: { text: ['هذه القناة مخصصة للشركات وأصحاب العمل ومسؤولي التوظيف الراغبين في مناقشة وظيفة أو عقد أو تعاون معي.', 'وهي ليست نموذجًا لتقديم المرشحين على الوظائف.'], cta: 'اعرض فرصة' }
  }
};

function updateNotice() {
  var box = document.getElementById('notice');
  if (!box || !typeSelect) return;
  var t = typeSelect.value;
  var kind = ['enquiry', 'pcb', 'full', 'embedded', 'automation'].indexOf(t) !== -1 ? 'project' : (t === 'job' ? 'job' : '');
  if (!kind) { box.hidden = true; box.removeAttribute('data-kind'); return; }
  var n = NOTICES[currentLang][kind];
  var txt = document.getElementById('notice-text');
  txt.textContent = '';
  n.text.forEach(function (line) { var p = document.createElement('p'); p.textContent = line; txt.appendChild(p); });
  var a = document.getElementById('notice-cta');
  a.textContent = n.cta;
  a.href = kind === 'job' ? EMPLOYMENT_FORM_URL : PROJECT_FORM_URL + '?service=' + encodeURIComponent(t);
  if (box.getAttribute('data-kind') !== kind) {
    box.hidden = false;
    box.setAttribute('data-kind', kind);
    box.classList.remove('in'); void box.offsetWidth; box.classList.add('in');
  }
}

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
  updateNotice();
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


/* ---------- Power converter scope: buck, boost, flyback ---------- */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var sw = $('sw-trace'), il = $('il-trace'), slider = $('duty'), preset = $('preset'), svg = $('scope-svg');
  if (!sw || !il || !slider) return;
  var outDuty = $('out-duty'), outVout = $('out-vout'), outRipple = $('out-ripple'), outVpk = $('out-vpk');
  var W = 640, PERIOD_PX = 112, SW_LOW = 132, SW_H = 80;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phase = 0, topo = 'buck';

  // Ideal continuous-conduction models, for illustration
  var TOPO = {
    buck: {
      min: 5, max: 95, def: 41.7, vmax: 12, zero: 270, ilY: 204,
      title: ['Buck converter', 'محوّل Buck'], sub: ['12 V in', 'دخل 12 V'], preset: ['Set for 5 V', 'اضبط على 5 V'],
      note: ['Ideal model: output = duty cycle × input. 22 µH, 500 kHz, 1 A load. An illustration, not a measurement from my boards.', 'نموذج مثالي: الخرج = دورة التشغيل × الدخل. ملف 22 µH وتردد 500 kHz وحمل 1 A. للتوضيح فقط، وليست قياسًا من لوحاتي.'],
      yI: function (A) { return 270 - (A - 1) * 220; },
      calc: function (d) {
        var vo = d * 12, r = (12 - vo) * d / (22e-6 * 500e3), avg = 1;
        return { vo: vo, rip: r, vpk: 12, vOn: 12, vOff: 0, a0: avg - r / 2, a1: avg + r / 2, b0: avg + r / 2, b1: avg - r / 2, ilText: 'Inductor current, 1 A average' };
      }
    },
    boost: {
      min: 5, max: 80, def: 58.3, vmax: 25, zero: 340, ilY: 160,
      title: ['Boost converter', 'محوّل Boost'], sub: ['5 V in', 'دخل 5 V'], preset: ['Set for 12 V', 'اضبط على 12 V'],
      note: ['Ideal model: output = input ÷ (1 − duty cycle). 5 V in, 22 µH, 500 kHz, 0.5 A load. An illustration, not a measurement from my boards.', 'نموذج مثالي: الخرج = الدخل ÷ (1 − دورة التشغيل). دخل 5 V وملف 22 µH وتردد 500 kHz وحمل 0.5 A. للتوضيح فقط، وليست قياسًا من لوحاتي.'],
      yI: function (A) { return 340 - A * 60; },
      calc: function (d) {
        var vo = 5 / (1 - d), r = 5 * d / (22e-6 * 500e3), avg = 0.5 / (1 - d);
        return { vo: vo, rip: r, vpk: vo, vOn: 0, vOff: vo, a0: avg - r / 2, a1: avg + r / 2, b0: avg + r / 2, b1: avg - r / 2, ilText: 'Inductor current, ' + avg.toFixed(1) + ' A average' };
      }
    },
    flyback: {
      min: 10, max: 50, def: 38.5, vmax: 30, zero: 340, ilY: 160,
      title: ['Flyback converter (isolated)', 'محوّل Flyback (معزول)'], sub: ['12 V in, n = 1.5', 'دخل 12 V، n = 1.5'], preset: ['Set for 5 V', 'اضبط على 5 V'],
      note: ['Ideal CCM model: output = input × duty ÷ (1 − duty) ÷ n, with n = Np:Ns = 1.5, 40 µH primary, 500 kHz, 1 A load. Leakage spike and losses are not modelled. An illustration, not a measurement from my boards.', 'نموذج مثالي في وضع التوصيل المستمر: الخرج = الدخل × دورة التشغيل ÷ (1 − دورة التشغيل) ÷ n، حيث n = Np:Ns = 1.5، وملف أولي 40 µH وتردد 500 kHz وحمل 1 A. لا يشمل النموذج ذروة الحث التسريبي ولا الفقد. للتوضيح فقط، وليست قياسًا من لوحاتي.'],
      yI: function (A) { return Math.max(175, 340 - A * 70); },
      calc: function (d) {
        var n = 1.5, vo = 12 * d / (1 - d) / n, vpk = 12 / (1 - d), r = 12 * d / (40e-6 * 500e3), im = 1 / (n * (1 - d));
        return { vo: vo, rip: r, vpk: vpk, vOn: 0, vOff: vpk, a0: im - r / 2, a1: im + r / 2, b0: n * (im + r / 2), b1: n * (im - r / 2), ilText: 'Primary (rising), secondary (falling) current' };
      }
    }
  };

  function setT(el, pair) {
    if (!el) return;
    el.setAttribute('data-ar', pair[1]); el.dataset.en = pair[0];
    el.textContent = currentLang === 'ar' ? pair[1] : pair[0];
  }

  function model() { return TOPO[topo].calc(parseFloat(slider.value) / 100); }

  function draw() {
    var c = TOPO[topo], d = parseFloat(slider.value) / 100, m = c.calc(d);
    var yv = function (v) { return SW_LOW - v / c.vmax * SW_H; };
    var vOn = yv(m.vOn), vOff = yv(m.vOff);
    var offset = phase % PERIOD_PX, swPts = [], ilPts = [], n = Math.ceil(W / PERIOD_PX) + 2;
    for (var k = -1; k < n; k++) {
      var x0 = k * PERIOD_PX - offset, xo = x0 + d * PERIOD_PX, x1 = x0 + PERIOD_PX;
      swPts.push(x0 + ',' + vOn, xo + ',' + vOn, xo + ',' + vOff, x1 + ',' + vOff);
      ilPts.push(x0 + ',' + c.yI(m.a0), xo + ',' + c.yI(m.a1), xo + ',' + c.yI(m.b0), x1 + ',' + c.yI(m.b1));
    }
    sw.setAttribute('points', swPts.join(' '));
    il.setAttribute('points', ilPts.join(' '));
  }

  function readouts() {
    var m = model(), duty = (parseFloat(slider.value)).toFixed(1) + '%', vout = m.vo.toFixed(2) + ' V';
    outDuty.textContent = duty; outVout.textContent = vout;
    outRipple.textContent = m.rip.toFixed(2) + ' A';
    outVpk.textContent = m.vpk.toFixed(1) + ' V';
    $('chan-sw-t').textContent = 'Switch node, ' + m.vpk.toFixed(0) + ' V peak';
    $('chan-il-t').textContent = m.ilText;
    slider.setAttribute('aria-valuetext', duty + ' / ' + vout);
  }

  function update() { readouts(); draw(); }

  function setTopo(name) {
    topo = name; var c = TOPO[name];
    [].slice.call(document.querySelectorAll('.topo .tab')).forEach(function (t) {
      var on = t.getAttribute('data-topo') === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
    });
    slider.min = c.min; slider.max = c.max; slider.value = c.def;
    setT($('scope-title'), c.title); setT($('scope-sub'), c.sub); setT(preset, c.preset); setT($('scope-note'), c.note);
    var ref = $('ref-line'); ref.setAttribute('y1', c.zero); ref.setAttribute('y2', c.zero);
    $('chan-il-t').setAttribute('y', c.ilY);
    update();
  }

  document.querySelectorAll('.topo .tab').forEach(function (t, i, all) {
    t.addEventListener('click', function () { setTopo(t.getAttribute('data-topo')); });
    t.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      if (document.documentElement.dir === 'rtl') step = -step;
      var nx = all[(i + step + all.length) % all.length]; nx.focus(); setTopo(nx.getAttribute('data-topo')); e.preventDefault();
    });
  });

  slider.addEventListener('input', update);
  preset.addEventListener('click', function () { slider.value = TOPO[topo].def; update(); });
  update();

  // Slowly scroll the traces like a live scope, only while on screen
  if (reduceMotion) return;
  var visible = false, last = null, SPEED = 36;
  function frame(t) {
    if (last === null) last = t;
    var dt = Math.min((t - last) / 1000, 0.1); last = t;
    if (visible && !document.hidden) { phase += dt * SPEED; draw(); }
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(svg);
  } else { visible = true; }
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


/* ---------- Keep what was typed when opening a detailed form ---------- */
(function () {
  var cta = document.getElementById('notice-cta');
  if (!cta || !form) return;
  cta.addEventListener('click', function () {
    var d = {};
    ['name', 'email', 'phone', 'message', 'company', 'organization'].forEach(function (k) {
      var el = form.elements[k];
      if (el && !el.disabled && el.value) d[k] = el.value;
    });
    try { sessionStorage.setItem('draft', JSON.stringify(d)); } catch (e) {}
  });
})();


/* ---------- Live "last updated" from GitHub ----------
   Reads each linked repository's latest push date, so the site follows your repos. */
(function () {
  var spans = [].slice.call(document.querySelectorAll('[data-repo-updated]'));
  if (!spans.length || !window.fetch) return;
  function render() {
    spans.forEach(function (sp) {
      var iso = sp.dataset.iso; if (!iso) return;
      var d = new Date(iso);
      sp.textContent = (currentLang === 'ar' ? 'آخر تحديث: ' : 'Updated ') + d.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-GB', { month: 'short', year: 'numeric' });
    });
  }
  spans.forEach(function (sp) {
    var repo = sp.getAttribute('data-repo-updated'), key = 'gh:' + repo, c = null;
    try { c = JSON.parse(sessionStorage.getItem(key)); } catch (e) {}
    if (c && Date.now() - c.t < 36e5) { sp.dataset.iso = c.iso; render(); return; }
    fetch('https://api.github.com/repos/ae-hesham/' + repo, { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.pushed_at) return;
        sp.dataset.iso = j.pushed_at; render();
        try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), iso: j.pushed_at })); } catch (e) {}
      })
      .catch(function () {});
  });
  var tg = document.getElementById('lang-toggle');
  if (tg) tg.addEventListener('click', function () { setTimeout(render, 0); });
})();
