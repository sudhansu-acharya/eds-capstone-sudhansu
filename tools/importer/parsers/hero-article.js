/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-article
 * Base block: hero
 * Source: https://wknd-trendsetters.site/blog/ace-pro-court-polo (template: blog-article)
 * Generated: 2026-08-24
 *
 * Article masthead rendered as a 2-column grid:
 *   - Cell 1: cover image (img.cover-image)
 *   - Cell 2: breadcrumb trail, article title (h1), byline, date + read-time meta, category tag pill
 * Decorative SVG icons (data: URIs) inside the breadcrumbs are dropped.
 */
export default function parse(element, { document }) {
  // Cover image (left/first cell)
  const image = element.querySelector('img.cover-image, img[class*="cover"], img');

  // Content column (second cell) — assemble in reading order
  const contentCell = [];

  // Breadcrumb trail — keep the links, drop decorative SVG/data-URI separator icons
  const breadcrumbs = element.querySelector('.breadcrumbs');
  if (breadcrumbs) {
    breadcrumbs.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (!src || src.startsWith('data:')) img.remove();
    });
    contentCell.push(breadcrumbs);
  }

  // Article title
  const title = element.querySelector('h1, h2, [class*="h2-heading"], [class*="heading"]');
  if (title) contentCell.push(title);

  // Byline + date/read-time meta lines (flex-horizontal rows, excluding breadcrumbs)
  const metaLines = Array.from(element.querySelectorAll('.flex-horizontal'))
    .filter((el) => !el.closest('.breadcrumbs'));
  metaLines.forEach((line) => contentCell.push(line));

  // Category tag pill
  const tag = element.querySelector('.tag');
  if (tag) contentCell.push(tag);

  // Empty-block guard
  if (!image && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 2-column layout: image cell | content cell
  const cells = [];
  cells.push([image || '', contentCell.length ? contentCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
