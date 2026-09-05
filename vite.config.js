import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1600,
  },
  server: {
    watch: {
      // public/assets holds your video/audio/image files, not source code —
      // there's nothing to hot-reload there, and watching large media files
      // is what triggers EBUSY errors on Windows (a locked/still-writing
      // file, OneDrive sync, antivirus scan, etc). Excluding it fixes that
      // and also makes the dev server noticeably lighter once you've added
      // a lot of media.
      ignored: ["**/public/assets/**"],
      // Uncomment the line below if you still hit EBUSY / files not
      // reloading after this — it trades a little CPU for watching via
      // polling instead of native OS file events, which sidesteps most
      // remaining Windows/OneDrive/network-drive locking issues.
      // usePolling: true,
    },
  },
});
