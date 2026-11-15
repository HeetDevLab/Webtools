# HeetDevLab WebTools

A collection of browser-based utilities published as a static website.

## Tool groups

### Security & access
- Password Generator — `tools/password-generator/`
- Password Strength Checker — `tools/password-checker/`
- PIN Generator — `tools/pin-generator/`
- Secure Notes — `tools/secure-notes/`

### Developer toolkit
- JWT Decoder — `tools/jwt-decoder/`
- JWT Generator — `tools/jwt-generator/`
- Hash Generator — `tools/hash-generator/`
- Hash Compare — `tools/hash-compare/`

## Project structure

- `index.html`, `style.css`, `script.js` — homepage, responsive styles and catalogue interactions.
- `tools/<tool-name>/index.html` — individual tool page.
- `tools/<tool-name>/style.css` — tool-specific styles.
- `tools/<tool-name>/script.js` — tool-specific interactions.
- `js/` — shared scripts used by tools (hashing and notes).
- `particles-config.js` — shared particle background configuration.
- `manifest.json`, `icon-192.png`, `icon-512.png`, `offline.html` — PWA metadata and supporting assets.

## Compatibility

The former `tools/<tool-name>.html` URLs are kept as redirect pages so older bookmarks continue to reach the folder-based tool pages.

## Local preview

Serve this directory with any static HTTP server and open the root page. Tool pages use relative asset paths, so preview the site from the repository root rather than opening individual HTML files directly.

## Deployment

The site is configured for the existing GitHub Pages path at `/Webtools/`. Keep the manifest `start_url` and `scope` aligned with that base path if the hosting path changes.
