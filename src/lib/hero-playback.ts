/** Autoplay policy and pause/load interruptions do not mean a clip is broken. */
export function isRecoverableHeroPlaybackError(error: unknown): boolean {
  const name = error instanceof Error ? error.name : "";
  return name === "NotAllowedError" || name === "AbortError";
}

/** Attach sources on demand; idle clips should not start downloading/decoding. */
export function prepareHeroVideo(video: HTMLVideoElement, src: string): void {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  if (video.getAttribute("src") !== src) {
    video.preload = "auto";
    video.src = src;
    video.load();
  }
}

export async function playHeroVideo(video: HTMLVideoElement, src: string): Promise<void> {
  prepareHeroVideo(video, src);
  if (video.ended) video.currentTime = 0;
  if (!video.paused) return Promise.resolve();
  return video.play() ?? Promise.resolve();
}
