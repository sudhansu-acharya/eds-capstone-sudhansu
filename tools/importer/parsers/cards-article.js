/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base block: cards.
 * Source: https://wknd-trendsetters.site/blog
 * Generated: 2026-08-19
 *
 * Library structure (2 columns, one row per card):
 *   Row 1: block name
 *   Row N: [ image cell, text content cell ]
 *     Cell 1: card image (mandatory)
 *     Cell 2: meta (tag + date), heading, optional CTA
 */
export default function parse(element, { document }) {
  // Each card is an anchor/article-card. Validated against source.html.
  let cards = Array.from(
    element.querySelectorAll(':scope > a.article-card, :scope > .article-card'),
  );
  // Fallback: any article-card descendant if none found as direct children.
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll('a.article-card, .article-card'));
  }

  const cells = [];

  cards.forEach((card) => {
    // Image cell.
    const image = card.querySelector(
      '.article-card-image img, img.cover-image, img[class*="cover"], img',
    );
    const imageCell = [];
    if (image) imageCell.push(image);

    // Content cell.
    const contentCell = [];
    const meta = card.querySelector('.article-card-meta, [class*="meta"], .flex-horizontal');
    if (meta) contentCell.push(meta);

    const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');

    // Preserve the card link by wrapping the heading text in the card's href.
    const href = card.getAttribute('href');
    if (heading) {
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent;
        contentCell.push(link);
      } else {
        contentCell.push(heading);
      }
    }

    // Additional description paragraphs (not already in meta), if any.
    const paragraphs = Array.from(card.querySelectorAll('.article-card-body p')).filter(
      (p) => !meta || !meta.contains(p),
    );
    contentCell.push(...paragraphs);

    // Only add a row if the card has content.
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
