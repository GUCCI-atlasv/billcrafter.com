"use client";

// Click-to-load YouTube facade.
//
// Why not a plain <iframe>: each YouTube embed pulls well over a megabyte of
// script and executes it on load. Three of them on the home page would wreck LCP
// and INP on exactly the pages we care most about ranking. So we render a
// thumbnail plus a play button, and only mount the real iframe once the visitor
// asks for it — at which point autoplay makes the extra click invisible.
//
// It also means no YouTube cookies are set for people who never press play.
import { useState } from "react";
import { thumb, thumbFallback, embedUrl } from "@/lib/videos";

export default function VideoEmbed({ video, priority = false }) {
  const [playing, setPlaying] = useState(false);
  const [src, setSrc] = useState(thumb(video.id));

  if (playing) {
    return (
      <div className="vid-frame">
        <iframe
          src={`${embedUrl(video.id)}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="vid-frame vid-facade"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${video.title}`}
    >
      <img
        src={src}
        alt=""
        width="1280"
        height="720"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // maxresdefault only exists for HD uploads; drop to hqdefault if missing.
        onError={() => setSrc(thumbFallback(video.id))}
      />
      <span className="vid-play" aria-hidden="true">
        <svg viewBox="0 0 68 48" width="54" height="38">
          <path className="vid-play-bg" d="M66.5 7.7a8.6 8.6 0 0 0-6-6C55.2 0 34 0 34 0S12.8 0 7.5 1.6a8.6 8.6 0 0 0-6 6A89.6 89.6 0 0 0 0 24a89.6 89.6 0 0 0 1.5 16.3 8.6 8.6 0 0 0 6 6C12.8 48 34 48 34 48s21.2 0 26.5-1.7a8.6 8.6 0 0 0 6-6A89.6 89.6 0 0 0 68 24a89.6 89.6 0 0 0-1.5-16.3z" />
          <path d="M45 24 27 14v20z" fill="#fff" />
        </svg>
      </span>
    </button>
  );
}
