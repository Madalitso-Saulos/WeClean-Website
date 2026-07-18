# WeClean Services — Website

A single-page, responsive website for WeClean Services (Blantyre, Malawi), built with HTML5, CSS3, TypeScript, and a PHP contact-form handler.

## Files

```
weclean/
├── index.html          Main page (all sections)
├── css/style.css        All styling, animations, responsive layout
├── ts/script.ts          TypeScript source (edit this)
├── js/script.js          Compiled JavaScript (loaded by index.html)
├── php/contact.php       Form handler — validates + emails/logs submissions
└── tsconfig.json         TypeScript compiler config
```

## Running it locally

You need a PHP-capable web server for the contact form to work (a plain
double-click on `index.html` will render the design, but the form's `fetch`
call needs a real server to hit `php/contact.php`).

**Quickest option — PHP's built-in server:**
```bash
cd weclean
php -S localhost:8000
```
Then open http://localhost:8000 in your browser.

**Alternative:** copy the `weclean/` folder into your XAMPP/MAMP/WAMP
`htdocs` directory, or upload it to any standard PHP hosting (most Malawian
hosts and cPanel providers support PHP out of the box).

## Editing the TypeScript

If you change `ts/script.ts`, recompile it with:
```bash
npx tsc -p tsconfig.json
```
This regenerates `js/script.js`. The browser only ever loads the compiled
`.js` file, so `index.html` never needs to change for TS edits.

## Before you go live

1. **Images** — all photos currently point to Unsplash placeholder URLs.
   Replace the `src` attributes in `index.html` with real photos of your
   team, premises, and completed jobs.
2. **Contact details** — swap the placeholder phone number
   (`+265 XXX XXX XXX`) in `index.html` for your real number, and set
   `$recipientEmail` at the top of `php/contact.php` to the inbox that
   should receive enquiries.
3. **Email delivery** — PHP's built-in `mail()` function needs a
   configured mail server/SMTP relay on your host to actually deliver
   messages. Most shared hosting providers have this set up already; on
   local dev servers it will typically fail silently, which is why every
   submission is also appended to `php/submissions.log` as a backup.
4. **Google Map** — the contact section currently has a placeholder map
   card. Swap it for a real embedded Google Map iframe with your address.
5. **Social links** — the footer's Facebook/Instagram/WhatsApp/LinkedIn
   icons are placeholders (`#`); point them to your real profiles.

## Design tokens

- Colors: Deep Blue `#0F4C81`, Aqua `#00B8D9`, Green `#22C55E`, white/light-gray backgrounds
- Headings: Poppins — Body: Inter
- All colors and spacing are defined as CSS custom properties at the top of `css/style.css` for easy theming.
