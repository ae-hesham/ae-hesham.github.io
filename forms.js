/* Multi-step enquiry forms: project inquiry and employment opportunity */
var FS = {
  en: { sending: 'Sending…', sent: 'Thank you. Your request was sent and I will reply by email.', failed: 'The request could not be sent. Please email me at ', mailto: 'Your email app should open with the request filled in. If it does not, write to ', none: 'Not provided' },
  ar: { sending: 'جارٍ الإرسال…', sent: 'شكرًا لك. تم إرسال طلبك وسأرد عليك بالبريد الإلكتروني.', failed: 'تعذّر إرسال الطلب. من فضلك راسلني على ', mailto: 'يجب أن يُفتح تطبيق البريد وبه الطلب جاهزًا. إن لم يُفتح، راسلني على ', none: 'غير مذكور' }
};

(function () {
  var f = document.getElementById('flow');
  if (!f) return;
  var steps = [].slice.call(f.querySelectorAll('.step'));
  var dots = [].slice.call(document.querySelectorAll('.steps li'));
  var back = document.getElementById('flow-back'), next = document.getElementById('flow-next'), send = document.getElementById('flow-send');
  var status = document.getElementById('flow-status'), idx = 0, last = steps.length - 1;

  function say(text, err, html) { status.classList.toggle('is-error', !!err); if (html) status.innerHTML = html; else status.textContent = text; }

  function show(i, focus) {
    idx = i;
    steps.forEach(function (s, j) { s.hidden = j !== i; });
    dots.forEach(function (d, j) { d.classList.toggle('on', j === i); d.classList.toggle('done', j < i); if (j === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
    back.hidden = i === 0; next.hidden = i === last; send.hidden = i !== last;
    if (i === last) review();
    if (focus) { var c = steps[i].querySelector('input,select,textarea'); if (c) c.focus({ preventScroll: true }); f.scrollIntoView({ block: 'start' }); }
  }

  function valid() {
    var ok = true;
    [].slice.call(steps[idx].querySelectorAll('input,select,textarea')).forEach(function (c) {
      if (ok && !c.checkValidity()) { c.reportValidity(); ok = false; }
    });
    return ok;
  }

  function labelOf(c) {
    var l = c.id && f.querySelector('label[for="' + c.id + '"]');
    if (l) return l.textContent.replace(/\(.*?\)|（.*?）/g, '').trim();
    var lg = c.closest('fieldset') && c.closest('fieldset').querySelector('legend');
    return lg ? lg.textContent.trim() : c.name;
  }

  function review() {
    var dl = document.getElementById('review'); if (!dl) return;
    dl.textContent = '';
    var seen = {};
    [].slice.call(f.querySelectorAll('input,select,textarea')).forEach(function (c) {
      if (!c.name || c.name === 'botcheck' || c.type === 'checkbox' || c.type === 'hidden' || seen[c.name]) return;
      var val;
      if (c.type === 'radio') {
        var on = f.querySelector('input[name="' + c.name + '"]:checked');
        val = on ? on.closest('label').textContent.trim() : '';
      } else if (c.tagName === 'SELECT') val = c.options[c.selectedIndex].textContent;
      else val = c.value.trim();
      seen[c.name] = 1;
      var dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = labelOf(c); dd.textContent = val || FS[currentLang].none;
      dl.appendChild(dt); dl.appendChild(dd);
    });
  }

  next.addEventListener('click', function () { if (valid()) show(idx + 1, true); });
  back.addEventListener('click', function () { show(idx - 1, true); });
  var tg = document.getElementById('lang-toggle');
  if (tg) tg.addEventListener('click', function () { setTimeout(function () { if (idx === last) review(); }, 0); });

  // Prefill from the link and from the compact contact box
  var q = new URLSearchParams(location.search);
  var sv = q.get('service'), r = sv && f.querySelector('input[name="service"][value="' + sv + '"]');
  if (r) r.checked = true;
  var rel = document.getElementById('f-related'); if (rel && q.get('project')) rel.value = q.get('project');
  try {
    var d = JSON.parse(sessionStorage.getItem('draft') || '{}');
    var map = { name: 'name', email: 'email', company: 'company', message: 'description' };
    Object.keys(map).forEach(function (k) {
      var el = f.elements[map[k]];
      if (el && !el.value && d[k]) el.value = d[k];
    });
  } catch (e) {}

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (idx < last) { if (valid()) show(idx + 1, true); return; }
    if (f.querySelector('[name="botcheck"]').value) return;
    if (!valid()) return;
    var fields = {};
    new FormData(f).forEach(function (v, k) { if (k !== 'botcheck') fields[k] = fields[k] ? fields[k] + ', ' + v : String(v); });
    var what = fields.project_name || fields.position || '';
    var subject = f.getAttribute('data-subject') + (what ? ': ' + what : '');

    if (!WEB3FORMS_KEY) {
      say(FS[currentLang].mailto + CONTACT_EMAIL + '.', false);
      var body = Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; }).join('\n');
      location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      return;
    }
    fields.access_key = WEB3FORMS_KEY; fields.subject = subject; fields.from_name = 'Portfolio website';
    send.disabled = true; say(FS[currentLang].sending, false);
    fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(fields) })
      .then(function (res) { return res.json().then(function (j) { return res.ok && j.success; }); })
      .then(function (ok) {
        if (!ok) throw new Error('rejected');
        f.reset(); show(0); say(FS[currentLang].sent, false);
        try { sessionStorage.removeItem('draft'); } catch (x) {}
      })
      .catch(function () { say('', true, FS[currentLang].failed + '<a href="mailto:' + CONTACT_EMAIL + '" dir="ltr">' + CONTACT_EMAIL + '</a>.'); })
      .then(function () { send.disabled = false; });
  });

  show(0);
})();
