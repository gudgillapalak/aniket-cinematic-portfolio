# Aniket Bhanjadeo — Cinematic Portfolio

A cinematic, film-first portfolio built with React + Vite. All professional
content (summary, experience, education, skills) comes directly from
Aniket's CV — nothing about his background is invented. Media (video,
music, photos, 3D) is intentionally empty until you drop in real files;
every section renders a clean "coming soon" state rather than fake stock
content.

## Install & run

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview   # optional: serve the built dist/ locally
```

The build has already been verified to run `npm install` and `npm run build`
successfully with no errors.

### Windows: `Error: EBUSY` when running `npm run dev`

If `npm run dev` throws an `EBUSY` error from the file watcher after you've
added video/audio files to `public/assets`, it's Vite trying to watch a
media file that's still locked by another process (still copying, open in
another app, mid antivirus-scan, or the project living inside a
OneDrive-synced folder). `vite.config.js` already excludes `public/assets`
from the watcher, which fixes this in almost every case. If it still
happens: close whatever has the file open, wait a few seconds after
copying a file in before restarting `npm run dev`, and if it persists,
uncomment the `usePolling: true` line in `vite.config.js`.

---

## Adding your media

You never need to touch a React component to add media — everything is
wired through **`src/data/media.js`**. Drop the file in the matching
folder, add one line to that file, save.

### Adding videos

Place files in the relevant `public/assets/videos/...` subfolder:

- `public/assets/videos/hero/` — the fullscreen hero background video
- `public/assets/videos/cinematography/` — clips for the Videos gallery
- `public/assets/videos/projects/` — the main showreel behind "PLAY REEL"

Then register them in `src/data/media.js`. The hero:

```js
heroVideo: "/assets/videos/hero/hero-showreel.mp4",
```

Every clip in the Videos section lives in the `videos` array — add as
many as you want:

```js
videos: [
  { title: "Clip Name", category: "Short Film", year: "2025",
    video: "/assets/videos/cinematography/clip-01.mp4" },
],
```

**Important:** files in `public/` are served from the site root, so the
path in code is `/assets/videos/...`, never `/public/assets/videos/...`.

### Adding audio

Put audio files in `public/assets/music/tracks/`, then add an entry to
`media.audio` — add as many as you want, the player scrolls internally
past 8 tracks:

```js
{ title: "Track Name", role: "Written, mixed & mastered",
  duration: "3:24", audio: "/assets/music/tracks/track-01.mp3" }
```

The custom player (not the default browser widget) will pick it up
automatically — play/pause, seek, volume, and the bar visualizer all work
off this array.

### Adding frames (stills)

Put images in `public/assets/images/frames/` and add entries to
`media.frames`:

```js
{ title: "Frame Name", category: "Portrait", image: "/assets/images/frames/frame-01.jpg" }
```

### Updating social links

Edit `src/data/social.js`. Only add URLs you actually have — an empty
array simply hides that row in the footer instead of showing broken links.

### Updating media registry directly

`src/data/media.js` is the single source of truth for every media path
on the site — hero video, showreel, videos, audio, and frames. Comments
in the file show the exact shape each array expects.

### Adding your CV

The CV PDF is already included at `public/assets/cv/Aniket-Bhanjadeo-CV.pdf`
and wired up via `media.cv`. Replace that file (keep the same name, or
update the path in `media.js`) to update the "View / Download CV" link.

---

## Project structure

```
aniket-cinematic-portfolio/
├── public/
│   └── assets/
│       ├── videos/{hero,cinematography,music,projects}
│       ├── music/{tracks,previews}
│       ├── images/{frames,portraits,projects,thumbnails}
│       └── cv/
├── src/
│   ├── components/
│   │   ├── layout/        → Footer
│   │   ├── navigation/    → Navigation (desktop bar + fullscreen mobile menu)
│   │   ├── cinematic/     → intro sequence, film grain, custom cursor
│   │   ├── hero/          → Hero
│   │   ├── three/         → HeroObject (generated 3D piece beside the hero title)
│   │   ├── sections/      → About, Cinematography, Music, VideoEditing,
│   │   │                    Photography, Design, Training, Projects
│   │   ├── gallery/       → HorizontalGallery (cinematography/photography)
│   │   ├── music/         → MusicPlayer (custom cinematic audio UI)
│   │   ├── video/         → ReelModal (fullscreen showreel player)
│   │   ├── media/         → LazyVideo, LazyImage, EmptyState
│   │   └── ui/            → Timecode (signature motif)
│   ├── data/          → profile.js, media.js, social.js, navigation.js, projects.js
│   ├── hooks/         → useInViewport, useCursorVariant, useSmoothScroll
│   ├── utils/         → formatTimecode
│   ├── styles/        → global.css, variables.css (design tokens)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Design notes

- **Palette**: one consistent, restrained palette — deep charcoal/black,
  warm ivory, muted teal, and antique gold. No neon, no high-saturation
  accents.
- **Type**: Cormorant Garamond (elegant serif for headlines), Manrope
  (body/UI), IBM Plex Mono (labels, timecodes, eyebrows).
- **Hero**: the giant headline is Aniket's name itself, with the roles
  line above it and the generated film-reel/vinyl object placed high on
  the right, roughly level with the name.
- **Signature motif**: a running film timecode in the bottom-right corner
  throughout the site, referencing Aniket's identity as an editor/DP.
- **Performance**: every video/image is wrapped in an IntersectionObserver
  — nothing loads or autoplays until it's actually in view, and videos
  pause the moment they scroll off screen.
- **Motion**: Lenis smooth scrolling + GSAP ScrollTrigger drive section
  reveals and the hero parallax; `prefers-reduced-motion` is respected
  globally.

## YouTube tracks

Give a track a `youtubeId` instead of `audio` in `src/data/media.js` and
it plays as a real, visible embedded video right in the Audio section —
same play/pause, seek bar, volume, and waveform controls as a local file.

## "View All" popups

Videos, Audio, and Frames each get a "VIEW ALL" button once they have
media — it opens every item in that section in one popup (a grid for
Videos/Frames, a list for Audio) so nothing stays hidden. Frames also
renders as a clean, uniform grid in the section itself, so every still is
visible on the page without opening anything.
