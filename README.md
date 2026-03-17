# rental-hero

Expo Router app configured for static web export and GitHub Pages deployment.

## Local web export

Use Node.js `20.19.4` or newer, then run:

```bash
npm ci
npm run build:web
```

The static site is exported to `dist/`.

## GitHub Pages CI/CD

This repo now includes [`.github/workflows/deploy-pages.yml`](/Users/waihynhtun/rentalHero/.github/workflows/deploy-pages.yml), which:

1. installs dependencies,
2. exports the Expo web build,
3. uploads `dist/`, and
4. deploys it to GitHub Pages on every push to `main`.

To enable it in GitHub:

1. Open the repository settings.
2. Go to `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.

The workflow passes the repository base path into Expo automatically, so project pages like `https://<user>.github.io/rentalHero/` work without hardcoding the repo name.
