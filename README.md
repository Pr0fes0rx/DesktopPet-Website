# DesktopPet Website — v3

A responsive Arabic/English landing page for DesktopPet for Windows.

## Publish with GitHub Pages
1. Upload the contents of this folder to the root of `Pr0fes0rx/DesktopPet-Website`.
2. Open **Settings → Pages**. Choose **Deploy from a branch**, branch `main`, folder `/(root)`, then save.
3. The site reads the latest published release from GitHub Releases. It uses the configured `v1.0.0` installer as a fallback.

## Release configuration
Edit `config.js` to change `githubRepo`, `releaseTag`, `version`, or `installerName`. The configured repository is `Pr0fes0rx/DesktopPet-Releases`.

## Design notes
- Quiet, editorial dark aesthetic with restrained lavender and mint accents.
- Scroll reveal and subtle mascot movement, with reduced-motion support.
- The full mascot image is contained inside the feature showcase (not cropped).
- No frontend frameworks or third-party animation dependencies.

## v4 (cute theme, app v1.2.1)
- `cute.css` / `cute.js`: pastel kawaii theme, interactive mascot (click, wink, hearts, speech bubbles, cursor sparkles).
- Poses: add images to `assets/poses/` and list them in `config.js` → `poses`.
- Release defaults updated to v1.2.1 and a "new features" section added.

## v5
- Poses switch by interaction (`pose.js`): default `1`, hover `4`, click `2`, scroll `3`, idle 7s `5` (files in `assets/*.webp`).
- Header: language button (AR/EN, RTL/LTR) + theme button (light/dark, saved in localStorage). Dark styles in `dark.css`.
- Button animations in `extras.css` (shine, bob, press, ripple) with reduced-motion support.
- Footer: © 2026 PROFESOR — All rights reserved / جميع الحقوق محفوظة.
