# WeClean Services — Website

A modern, responsive marketing website for **WeClean Services**, a professional cleaning company serving residential, commercial, and industrial clients across Malawi. The site showcases the company's services, credentials, and gallery, and includes a working contact form for service enquiries.

🔗 **Live site:** [weclean-services.netlify.app/](https://weclean-services.netlify.app/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Contact Form Setup](#contact-form-setup)
- [Deployment (Netlify)](#deployment-netlify)
- [Browser Support](#browser-support)
- [Author](#author)
- [License](#license)

---

## Overview

WeClean Services is a single-page site built to convert visitors into leads. It highlights the company's cleaning services, key differentiators, client testimonials, a photo gallery, and an embedded map — ending in a validated contact form that emails enquiries directly to the business.

## Features

- **Animated hero section** with rotating statistics (clients served, cleaners, years of experience, satisfaction rate)
- **Sticky, scroll-aware navigation** with an active-link indicator and mobile hamburger menu
- **Scroll-reveal animations** for sections, service cards, and gallery items using the Intersection Observer API
- **Custom animated cursor** (dot + trailing ring) on desktop
- **Scroll progress bar** and **back-to-top** button
- **Services showcase**: Residential, Office, Industrial, and Specialized Cleaning
- **"Why Choose Us"** feature grid
- **Auto-playing testimonial carousel** with dot navigation
- **Photo gallery** with a lightbox viewer
- **Embedded Google Map** of the business location
- **Client-side + server-side validated contact form** with real-time inline error messages and submission feedback
- Fully **responsive design** for mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties/design tokens, Flexbox & Grid, no framework) |
| Interactivity | TypeScript (compiled to `script.js`) |
| Icons | [Font Awesome](https://fontawesome.com/) & [Lucide Icons](https://lucide.dev/) |
| Fonts | [Poppins](https://fonts.google.com/specimen/Poppins) & [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| Backend (form handler) | PHP (with optional [PHPMailer](https://github.com/PHPMailer/PHPMailer) SMTP support) |
| Hosting | [Netlify](https://www.netlify.com/) |

## Project Structure

```
weclean-services/
├── index.html          # Main site markup (all sections)
├── style.css            # Global styles and design tokens
├── script.ts             # TypeScript source for site interactivity
├── script.js             # Compiled/plain JavaScript used by the browser
├── contact.php           # Server-side contact form handler (PHP)
├── images/                # Site imagery (hero, gallery, backgrounds, favicon)
└── README.md
```

## Getting Started

### Prerequisites

- A modern web browser
- A local static server (e.g. VS Code Live Server, `npx serve`, or Python's `http.server`) to preview the site
- PHP (for testing the contact form locally) — required only if you're running `contact.php` yourself

### Run locally

1. Clone or download this repository.
2. Serve the project root with any static file server, for example:
   ```bash
   npx serve .
   ```
   or
   ```bash
   python3 -m http.server 8000
   ```
3. Open the site in your browser at the address the server provides.

> Note: the contact form will not send emails when served as a static site (e.g. directly on Netlify) unless you configure a serverless-compatible submission handler — see [Contact Form Setup](#contact-form-setup) below.

## Contact Form Setup

`contact.php` handles form submissions, validates all fields server-side, logs enquiries to `submissions.log`, and emails the enquiry to the configured recipient — using [PHPMailer](https://github.com/PHPMailer/PHPMailer) over SMTP where available, with a fallback to PHP's native `mail()` function.

To configure it:

1. Open `contact.php` and set your recipient address and SMTP credentials in the **CONFIGURATION** block at the top of the file:
   ```php
   $recipientEmail = 'your-email@example.com';
   $smtpConfig = [
       'host'       => 'smtp.gmail.com',
       'port'       => 587,
       'username'   => 'your-email@gmail.com',
       'password'   => 'your-app-password',
       'encryption' => 'tls',
   ];
   ```
2. Install PHPMailer via Composer if you want SMTP delivery:
   ```bash
   composer require phpmailer/phpmailer
   ```
3. Deploy `contact.php` to a host that supports PHP (Netlify's static hosting does **not** execute PHP natively — pair it with a PHP-capable backend, or replace this handler with a Netlify Function / third-party form service such as Netlify Forms, Formspree, or EmailJS if you want the contact form to work entirely on Netlify).

⚠️ **Security note:** Never commit real SMTP credentials to version control. Use environment variables or a secrets manager in production, and rotate any credentials that may have been exposed in this file.

## Deployment (Netlify)

The static front end (`index.html`, `style.css`, `script.js`, and `images/`) is deployed via [Netlify](https://www.netlify.com/):

1. Push the project to a GitHub/GitLab/Bitbucket repository.
2. In Netlify, click **Add new site → Import an existing project** and connect the repository.
3. Set the build settings:
   - **Build command:** none (static site)
   - **Publish directory:** `/` (project root)
4. Deploy — Netlify will provide a live URL and automatically redeploy on every push to the connected branch.
5. (Optional) Add a custom domain and enable HTTPS from the Netlify dashboard.

Since Netlify does not run PHP, the contact form's backend (`contact.php`) needs to be hosted separately (e.g. on a PHP-capable server) with its endpoint URL updated in `index.html`, or replaced with a Netlify-native form solution.

## Browser Support

Tested on the latest versions of Chrome, Firefox, Safari, and Edge. The site uses modern browser APIs (Intersection Observer, `fetch`, CSS custom properties) and is not optimized for legacy browsers such as Internet Explorer.

## Author

**Madalitso Saulos**

## License

This project is provided for WeClean Services. All rights reserved unless otherwise licensed by the author.
