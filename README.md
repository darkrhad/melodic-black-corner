# 🎃Melodic Black Corner

40 melodic black metal albums from a Spotify folder, in country order, with Spotify and full-album YouTube links.

```
npm install
npm run dev
```

Album data: `src/albums.json`.

## Deploy

GitHub Pages: every push to `main` runs `.github/workflows/deploy.yml` → https://darkrhad.github.io/melodic-black-corner/

### Vercel

Import the GitHub repo on vercel.com; `vercel.json` sets the build (`npm run build` → `dist/`).
Every push to `main` redeploys.
