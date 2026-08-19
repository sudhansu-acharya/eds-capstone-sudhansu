/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta. Base block: hero.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Library "Hero" structure (1 column, 3 rows):
 *   Row 1: block name
 *   Row 2: [ background image ]  (single cell)
 *   Row 3: [ heading + subheading + CTA ]  (single cell, all content)
 *
 * Source note: full-bleed background image with dark overlay and overlaid
 * heading (h2.h1-heading), paragraph (p.subheading), and a single CTA button.
 */
export default function parse(element, { document }) {
  // Background image (full-bleed cover). Validated against source.html.
  const bgImage = element.querySelector(
    'img.cover-image, img.utility-overlay, img[class*="cover"], img',
  );

  // Overlaid content. The heading is an h2 styled as h1.
  const heading = element.querySelector('.card-body h1, .card-body h2, h1, h2, [class*="heading"]');
  const description = element.querySelector('.card-body p, p.subheading, p, [class*="subheading"]');
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, a.button, .card-body a'),
  );

  const cells = [];

  // Row 2: background image (single cell).
  if (bgImage) cells.push([bgImage]);

  // Row 3: text content (single cell holding all elements).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  // Empty-block guard.
  if (!heading && !description && ctaLinks.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
