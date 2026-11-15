# HeetDevLab WebTools

A focused collection of browser-based utilities. The site is a static project hosted under the GitHub Pages path `/Webtools/`.

## Available tools

### Security & access
| Tool | Folder |
|---|---|
| Password Generator | `tools/password-generator/` |
| Password Strength Checker | `tools/password-checker/` |
| PIN Generator | `tools/pin-generator/` |
| Secure Notes | `tools/secure-notes/` |

### Developer toolkit
| Tool | Folder |
|---|---|
| JWT Decoder | `tools/jwt-decoder/` |
| JWT Generator | `tools/jwt-generator/` |
| Hash Generator | `tools/hash-generator/` |
| Hash Compare | `tools/hash-compare/` |

## Repository layout

```text
.
├── index.html                 # Tool catalogue / homepage
├── style.css                  # Homepage design and responsive layout
├── script.js                  # Search, category filters and menu
├── css/
│   └── tool-shell.css         # Shared responsive layout for tool pages
├── js/
│   ├── hash.js                # Shared hash-generation logic
│   ├── hash-compare.js        # Shared hash comparison logic
│   └── notes.js               # Shared notes storage logic
├── tools/
│   ├── password-generator/
│   ├── password-checker/
│   ├── pin-generator/
│   ├── secure-notes/
│   ├── jwt-decoder/
│   ├── jwt-generator/
│   ├── hash-generator/
│   └── hash-compare/
├── manifest.json
├── icon-192.png
├── icon-512.png
├── offline.html
└── particles-config.js
```

## Tool folder convention

Every tool lives in its own folder and uses the same three-file layout:

- `index.html` — page structure and metadata.
- `style.css` — styles specific to that tool.
- `script.js` — tool-specific behavior.

Shared scripts belong in `js/`; shared tool-page layout rules belong in `css/tool-shell.css`. Keep tool-specific logic out of the shared shell.

## Legacy links

The older `tools/<tool-name>.html` URLs are retained as small redirect pages. Do not remove them unless their old URLs are no longer needed.

## Local preview

Run a static HTTP server from the repository root and open the root page. For example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/Webtools/` if the repository is served from a parent directory, or `http://localhost:8000/` if this folder is the server root.

## Deployment

GitHub Pages serves this project at `https://heetdevlab.github.io/Webtools/`. Keep the PWA manifest `start_url` and `scope` aligned with `/Webtools/` when changing hosting configuration.

## Privacy notes

The tools are designed to process input in the browser. This does not automatically mean data is encrypted: Secure Notes uses browser storage, so users should avoid storing highly sensitive secrets unless they understand the device and browser storage risks.
