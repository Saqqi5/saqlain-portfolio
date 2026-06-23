# Saqlyn Digital Services Portfolio

Premium personal brand and business portfolio for **Muhammad Saqlain Mushtaq**, Compliance & Risk Management Officer and founder of **Saqlyn Digital Services**.

**Tagline:** Design • AI • Growth

## Features

- Dark luxury visual identity with glassmorphism, gradients, and smooth animations
- Responsive HTML, CSS, and JavaScript only; no frameworks or build step
- Premium hero section with professional profile image placeholder
- About, achievements, services, portfolio, experience, categorized skills, testimonials, and lead-generation contact sections
- FormSubmit-powered contact form with validation, honeypot spam protection, success state, and error handling
- Email, WhatsApp, copy email, GitHub, LinkedIn, and email social links
- Dark/light mode, mobile navigation, floating back-to-top button, and accessible skip link
- SEO metadata, Open Graph tags, Twitter cards, favicon, structured data, robots.txt, and sitemap compatibility
- GitHub Pages and Cloudflare Pages ready

## Contact Form

The contact form posts to FormSubmit:

```text
https://formsubmit.co/saqlainmushtaq555@gmail.com
```

The form includes:

- Full Name
- Email Address
- Phone Number
- Service Required
- Message
- Honeypot spam protection
- Client-side validation and status messages

## Placeholder Links To Replace

Update these before final production launch:

- WhatsApp link in `index.html` currently uses `923000000000` as a placeholder number.
- GitHub link in `index.html` currently uses `https://github.com/your-github-username`.
- LinkedIn link in `index.html` currently uses `https://www.linkedin.com/in/your-linkedin-profile`.
- Canonical, Open Graph URL, `robots.txt`, and `sitemap.xml` should be updated if the final domain is not `https://saqlyn.com/`.
- Replace `assets/Muhammad-Saqlain-Mushtaq-CV.txt` with a PDF later if a designed CV is available.

## Run Locally

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

## Deploy on Cloudflare Pages

Use these settings:

- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/`
- Root directory: leave empty unless the project is inside a subfolder

## Deploy on GitHub Pages

Deploy from the repository root on the current branch. The `.nojekyll` file is included for compatibility.
