// Vercel serverless function: emails contact form submissions through Resend.
// Required environment variables (Vercel project, Settings, Environment Variables):
//   RESEND_API_KEY  - API key from resend.com
//   CONTACT_TO      - where messages are delivered
//   CONTACT_FROM    - verified sender, e.g. "Website <hello@amandahouseconsulting.com>"
//                     (before the domain is verified, use "onboarding@resend.dev")

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const { name = '', email = '', message = '', website = '' } = body;

  // Honeypot: real visitors never fill this field. Pretend success for bots.
  if (website) return res.status(200).json({ ok: true });

  if (!name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message.trim()) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'Too long' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO) {
    return res.status(500).json({ error: 'Not configured' });
  }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Website <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO],
      reply_to: email,
      subject: `New website message from ${name.slice(0, 80)}`,
      html: `<p><strong>Name:</strong> ${esc(name)}</p><p><strong>Email:</strong> ${esc(email)}</p><p>${esc(message).replace(/\n/g, '<br>')}</p>`
    })
  });

  if (!r.ok) return res.status(502).json({ error: 'Send failed' });
  return res.status(200).json({ ok: true });
};
