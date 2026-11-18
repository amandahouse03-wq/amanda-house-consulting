(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = form.querySelector('.form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      website: form.website.value
    };
    if (!data.name || !data.email || !data.message) {
      status.textContent = 'Please fill in your name, email and a short message.';
      return;
    }
    var btn = form.querySelector('button');
    btn.disabled = true;
    status.textContent = 'Sending...';
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error('bad status');
      form.reset();
      status.textContent = 'Thank you. Your message was sent, and I will be in touch soon.';
    }).catch(function () {
      status.textContent = 'Something went wrong. Please call 480.239.9409 or try again.';
    }).then(function () { btn.disabled = false; });
  });
})();
