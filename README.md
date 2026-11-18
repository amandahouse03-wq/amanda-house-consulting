# Amanda House Consulting website

Plain static site for amandahouseconsulting.com.

- `src/` page sources
- `build.py` wraps each source into a full page and writes it to `site/`
- `site/` what Vercel publishes
- `api/contact.js` contact form handler (needs RESEND_API_KEY, CONTACT_TO, CONTACT_FROM in Vercel)

Edit `src/`, run `python3 build.py`, commit the `site/` folder, push to `main`. Vercel republishes automatically.
