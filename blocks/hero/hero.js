/*
 * Hero Block
 * The default hero is auto-blocked (image background + overlaid content) and
 * needs no JS. The `video` variant swaps the background for a looping,
 * muted background video with the hero image used as the poster/fallback.
 *
 * Authoring the video variant:
 *   - Add the `video` variant to the block (Hero (video)).
 *   - Include a link to an .mp4 (or a bare video URL) anywhere in the block;
 *     it becomes the background video source.
 *   - An optional image is used as the poster and as a no-JS fallback.
 */

const VIDEO_EXT = /\.(mp4|webm|ogv|mov)(\?.*)?$/i;

function findVideoLink(block) {
  return [...block.querySelectorAll('a[href]')].find((a) => VIDEO_EXT.test(a.href));
}

export default function decorate(block) {
  if (!block.classList.contains('video')) return;

  const videoLink = findVideoLink(block);
  if (!videoLink) return;

  const src = videoLink.href;
  const poster = block.querySelector('img');

  const video = document.createElement('video');
  video.className = 'hero-video';
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;
  if (poster) video.poster = poster.src;

  const source = document.createElement('source');
  source.src = src;
  video.append(source);

  // remove the authored video link (and its wrapping paragraph if now empty)
  const linkParent = videoLink.parentElement;
  videoLink.remove();
  if (linkParent && linkParent.tagName === 'P' && !linkParent.textContent.trim() && !linkParent.querySelector('img, picture')) {
    linkParent.remove();
  }

  block.prepend(video);

  // best-effort autoplay (some browsers require an explicit call);
  // if it rejects, the poster frame remains visible
  const tryPlay = video.play();
  if (tryPlay && typeof tryPlay.catch === 'function') {
    tryPlay.catch(() => { /* poster remains visible */ });
  }
}
