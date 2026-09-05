// ============================================================================
// CENTRAL MEDIA REGISTRY
// ============================================================================
// This is the ONLY place you need to touch to connect your own video, music,
// image, and 3D files to the website. Components read from this file — they
// never hardcode a media path.
//
// HOW TO USE:
// 1. Drop your file into the matching folder inside public/assets/...
// 2. Add one entry below pointing at it (path starts with /assets/... — do
//    NOT include "/public" in the path, Vite serves public/ from the root).
// 3. Save. The section fills itself in automatically. Leave an array empty
//    (or omit heroVideo) and that part of the site shows a clean
//    "MEDIA COMING SOON" state instead of breaking or using a fake stand-in.
// ============================================================================

export const media = {
  // Fullscreen hero background video. Put a file at public/assets/videos/hero/
  // and point to it here. Leave as null until you have one — the hero still
  // works, it just opens on the cinematic title card instead of video.
  heroVideo: null, // e.g. "/assets/videos/hero/hero-showreel.mp4"
  heroPoster: null, // e.g. "/assets/images/thumbnails/hero-poster.jpg"

  // Main showreel / video editing reel.
  showreel: {
    video: null, // e.g. "/assets/videos/projects/showreel.mp4"
    poster: null,
  },

  // Videos section — cinematography, edits, and post-production selects.
  videos: [
    { title: "Video1", category: "", year: "", video: "assets/videos/cinematography/Video1.mp4" },
    { title: "Video2", category: "", year: "", video: "assets/videos/cinematography/Video2.mp4" },
    { title: "Video3", category: "", year: "", video: "assets/videos/cinematography/Video3.mp4" },
    { title: "Video4", category: "", year: "", video: "assets/videos/cinematography/Video4.mp4" },
    // { title: "", category: "", year: "", video: "/assets/videos/cinematography/...",
    //   thumbnail: "/assets/images/thumbnails/..." },
  ],

  audio: [
  { title: "DURR KYU",         role: "Written & Mixed", duration: "3:24", audio: "/assets/music/tracks/DURR KYU.mp3" },
  { title: "LAAPATA ACOUSTIC", role: "Written & Mixed", duration: "2:58", audio: "/assets/music/tracks/LAAPATA ACOUSTIC.mp3" },
  { title: "Mastered Man She", role: "Written & Mixed", duration: "2:58", audio: "/assets/music/tracks/mastered man she.mp3" },
],

  // Frames section — stills / photography.
  frames: [
    { title: "Frame1", category: "", year: "", image: "public/assets/images/frames/Frame1.jpeg" },
    { title: "Frame2", category: "", year: "", image: "public/assets/images/frames/Frame2.jpeg" },
    { title: "Frame3", category: "", year: "", image: "public/assets/images/frames/Frame3.jpeg" },
    { title: "Frame4", category: "", year: "", image: "public/assets/images/frames/Frame4.jpeg" },
    { title: "Frame5", category: "", year: "", image: "public/assets/images/frames/Frame5.jpeg" },
    { title: "Frame6", category: "", year: "", image: "public/assets/images/frames/Frame6.jpeg" },
    { title: "Frame7", category: "", year: "", image: "public/assets/images/frames/Frame7.jpeg" },
    { title: "Frame8", category: "", year: "", image: "public/assets/images/frames/Frame8.jpeg" },
    { title:"Frame9", category: "", year: "", image: "public/assets/images/frames/Frame9.jpeg" },
    { title: "Frame10", category: "", year: "", image: "public/assets/images/frames/Frame10.jpeg"},
    { title: "Frame11", category: "", year: "", image: "public/assets/images/frames/Frame11.jpeg" },
    { title: "Frame12", category: "", year: "", image: "public/assets/images/frames/Frame12.jpeg" },
    
    
    
    
    
    // { title: "", category: "", image: "/assets/images/frames/..." },
  ],

  cv: "/assets/cv/Aniket-Bhanjadeo-CV.pdf",
};