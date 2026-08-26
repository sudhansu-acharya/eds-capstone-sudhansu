/*
 * Breadcrumb Block
 * Adapted from the WKND reference site (github.com/hlxsites/wknd/blocks/breadcrumb),
 * generalized to reflect the actual current path instead of a hardcoded 2-crumb trail.
 *
 * No authored content needed — the trail is computed entirely from
 * window.location.pathname, with the final crumb labeled using the page's
 * og:title metadata (falling back to document.title, then the raw segment).
 */

import { getMetadata } from '../../scripts/aem.js';

function formatLabel(segment) {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function decorate(block) {
  const segments = window.location.pathname.split('/').filter(Boolean);

  const trail = [{ text: 'Home', link: '/' }];
  let path = '';
  segments.forEach((segment, i) => {
    path += `/${segment}`;
    const isLast = i === segments.length - 1;
    trail.push({
      text: isLast
        ? (getMetadata('og:title') || document.title || formatLabel(segment))
        : formatLabel(segment),
      link: isLast ? undefined : path,
    });
  });

  const ul = document.createElement('ul');
  trail.forEach((step) => {
    const li = document.createElement('li');
    let wrap = li;
    if (step.link) {
      wrap = document.createElement('a');
      wrap.href = step.link;
      li.append(wrap);
    }
    const span = document.createElement('span');
    span.textContent = step.text;
    wrap.append(span);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
