/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base block: cards.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Image-only gallery: 8 cards, one image per card, no text.
 * Library "Cards" is normally 2 columns (image, text). Since these cards have
 * no text content, each card is emitted as a single-cell row containing only
 * the image (the cards block renders an image-only card correctly from this).
 *   Row 1: block name
 *   Row N: [ image ]
 */
export default function parse(element, { document }) {
  // Each card wrapper is a .utility-aspect-1x1 div holding a single image.
  // Validated against source.html.
  let cardImages = Array.from(
    element.querySelectorAll(':scope > .utility-aspect-1x1 img, :scope > div > img'),
  );
  // Fallback: any cover-image / img descendant if the structure differs.
  if (cardImages.length === 0) {
    cardImages = Array.from(element.querySelectorAll('img.cover-image, img'));
  }

  const cells = [];
  cardImages.forEach((img) => {
    if (img) cells.push([img]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
