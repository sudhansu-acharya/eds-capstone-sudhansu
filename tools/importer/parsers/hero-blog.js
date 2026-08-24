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

  // Body paragraphs — source uses p.subheading plus optional additional body
  // paragraphs (e.g. the FAQ hero has a second descriptive paragraph). Capture
  // every paragraph in the text column so no copy is dropped. Exclude paragraphs
  // that only wrap a CTA link (those are handled separately below). Backward-
  // compatible: heroes with a single subheading paragraph are unaffected.
  const paragraphs = Array.from(element.querySelectorAll('p')).filter((p) => {
    const link = p.querySelector('a');
    return !(link && p.textContent.trim() === link.textContent.trim());
  });

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
  contentCell.push(...paragraphs);
  contentCell.push(...ctaLinks);

  // Empty-block guard
  if (!heading && paragraphs.length === 0 && ctaLinks.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-blog', cells });
  element.replaceWith(block);
}
