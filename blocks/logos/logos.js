/*
 * Logos Block
 * A row of partner/client logos, optionally scrolling as a marquee on larger screens.
 * Inspired by the community "logo marquee" pattern shared on Block Party
 * (https://www.aem.live/developer/block-party/).
 *
 * Expected authored structure — one row per logo, each cell either a bare image
 * or an image wrapped in a link.
 */

import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    img.closest('picture').replaceWith(optimized);
  });

  // duplicate the logo list once so the CSS marquee animation can loop seamlessly
  const clone = ul.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');

  const track = document.createElement('div');
  track.className = 'logos-track';
  track.append(ul, clone);

  block.replaceChildren(track);
}
