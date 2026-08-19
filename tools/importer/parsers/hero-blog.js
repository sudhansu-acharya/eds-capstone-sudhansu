/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-blog. Base block: hero.
 * Source: https://wknd-trendsetters.site/blog
 * Generated: 2026-08-19
 *
 * Library structure (1 column, 3 rows):
 *   Row 1: block name
 *   Row 2: Background Image (optional)
 *   Row 3: Title (heading), Subheading, Call-to-Action(s)
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION — selectors validated against source.html
  // Background/cover image (optional). Prefer explicit cover-image, fall back to any img.
  const bgImage = element.querySelector('img.cover-image, img[class*="cover"], img');

  // Title — source uses h1.h1-heading; allow other heading levels as fallback.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');

  // Subheading — source uses p.subheading.
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');

  // CTAs — source wraps links in .button-group.
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, a.button, a[class*="button"]'),
  );

  const cells = [];

  // Row 2: background image (only if present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: single cell holding all text content + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);

  // Empty-block guard
  if (!heading && !subheading && ctaLinks.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-blog', cells });
  element.replaceWith(block);
}
