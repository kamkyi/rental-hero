# rental-hero

Expo Router app configured for static web export and GitHub Pages deployment.

## Local web export

Use Node.js `22.x`, then run:

```bash
npm ci
npm run build:web
```

The static site is exported to `dist/`.

## Docker

Run the Expo web dev server in Docker with Node.js `22`:

```bash
docker compose up --build
```

The app will be available on `http://localhost:8081`.

## GitHub Pages CI/CD

This repo now includes [`.github/workflows/deploy-pages.yml`](/Users/waihynhtun/rentalHero/.github/workflows/deploy-pages.yml), which:

1. installs dependencies,
2. exports the Expo web build,
3. uploads `dist/`, and
4. deploys it to GitHub Pages on every push to `main`.

The workflow uses Node.js `22` to match local development and Docker.

To enable it in GitHub:

1. Open the repository settings.
2. Go to `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.

The workflow passes the repository base path into Expo automatically, so project pages like `https://<user>.github.io/rentalHero/` work without hardcoding the repo name.
