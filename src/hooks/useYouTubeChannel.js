import { useEffect, useState } from "react";
import { formatDuration } from "../utils/formatTimecode.js";

// ============================================================
// EDIT THESE TWO CONSTANTS — nothing else needs changing.
// ============================================================
//
// CHANNEL_ID  — the YouTube channel whose uploads you want.
//   Go to the channel page → click "..." → "Share" → "Copy channel ID"
//   It looks like: UCxxxxxxxxxxxxxxxxxxxxxx
//
// API_KEY  — a YouTube Data API v3 key from console.cloud.google.com.
//   Create a project → enable "YouTube Data API v3" → Credentials →
//   "Create credentials" → "API key". Restrict it to your domain once live.
//   Leave as empty string ("") to skip the fetch and use placeholder tracks.
//
const CHANNEL_ID = "";   // e.g. "UCxxxxxxxxxxxxxxxxxxxxxx"
const API_KEY    = "";   // e.g. "AIzaSy..."

// ============================================================
// Placeholder tracks shown while loading or when the API key
// isn't set yet. The player never breaks — it just shows these.
// ============================================================
const PLACEHOLDERS = [
  { id: "ph-1", title: "Sample Track 01", role: "Placeholder — replace with your track", duration: "0:07", youtubeId: null, audio: null },
  { id: "ph-2", title: "Sample Track 02", role: "Placeholder — replace with your track", duration: "0:07", youtubeId: null, audio: null },
  { id: "ph-3", title: "Untitled III",    role: "Add a YouTube ID or local file",         duration: null,  youtubeId: null, audio: null },
  { id: "ph-4", title: "Untitled IV",     role: "Add a YouTube ID or local file",         duration: null,  youtubeId: null, audio: null },
];

// Converts an ISO 8601 duration (PT3M42S) to "m:ss".
function parseDuration(iso) {
  if (!iso) return null;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const h = parseInt(match[1] || "0", 10);
  const m = parseInt(match[2] || "0", 10);
  const s = parseInt(match[3] || "0", 10);
  const totalSeconds = h * 3600 + m * 60 + s;
  return formatDuration(totalSeconds);
}

// Fetches the uploads playlist for CHANNEL_ID, then batch-fetches video
// durations, and returns tracks shaped for MusicPlayer.
// Falls back to PLACEHOLDERS on any error or missing config.
export function useYouTubeChannel() {
  const [tracks, setTracks] = useState(PLACEHOLDERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip fetch if either constant is missing.
    if (!CHANNEL_ID || !API_KEY) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchTracks() {
      try {
        // Step 1: get the channel's uploads playlist ID.
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
        );
        if (!channelRes.ok) throw new Error(`Channel fetch: ${channelRes.status}`);
        const channelData = await channelRes.json();
        const uploadsId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploadsId) throw new Error("No uploads playlist found for this channel.");

        // Step 2: get up to 50 most-recent uploads.
        const playlistRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsId}&key=${API_KEY}`
        );
        if (!playlistRes.ok) throw new Error(`Playlist fetch: ${playlistRes.status}`);
        const playlistData = await playlistRes.json();
        const items = playlistData.items ?? [];

        // Step 3: batch-fetch video durations (one request for all IDs).
        const videoIds = items
          .map((item) => item.snippet?.resourceId?.videoId)
          .filter(Boolean)
          .join(",");

        let durationMap = {};
        if (videoIds) {
          const durRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
          );
          if (durRes.ok) {
            const durData = await durRes.json();
            for (const v of durData.items ?? []) {
              durationMap[v.id] = parseDuration(v.contentDetails?.duration);
            }
          }
        }

        // Step 4: build track objects shaped for MusicPlayer.
        const fetched = items
          .map((item) => {
            const snippet = item.snippet ?? {};
            const videoId = snippet.resourceId?.videoId;
            if (!videoId) return null;
            return {
              id: videoId,
              title: snippet.title || "Untitled",
              role:  snippet.channelTitle || "",
              duration: durationMap[videoId] ?? null,
              youtubeId: videoId,
              audio: null,
            };
          })
          .filter(Boolean);

        if (!cancelled) {
          setTracks(fetched.length ? fetched : PLACEHOLDERS);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[useYouTubeChannel] fetch failed, using placeholders:", err.message);
          setError(err.message);
          setTracks(PLACEHOLDERS);
          setLoading(false);
        }
      }
    }

    fetchTracks();
    return () => { cancelled = true; };
  }, []); // runs once on mount

  return { tracks, loading, error };
}
