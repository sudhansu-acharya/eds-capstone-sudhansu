/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact. Base block: columns.
 * Source: https://wknd-trendsetters.site/faq
 * Generated: 2026-08-24
 *
 * Library structure (flexible columns):
 *   Row 1: block name
 *   Row 2: one cell per visual column. Source groups content into 2 columns:
 *     Col 1 (left): H2 "Let's connect" heading + intro paragraph
 *     Col 2 (right): a 3-up contact list; each entry has an H3 label
 *       (Email / Phone / Address) plus a link (mailto:/tel:) or plain
 *       address paragraph value. Text-only, no images.
 */
export default function parse(element, { document }) {
  // The two visual columns are the direct child <div>s of the grid.
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // INPUT EXTRACTION — validated against source.html

  // Left column: heading + intro paragraph.
  const heading = element.querySelector('h2, h1, h3, [class*="heading"]');

  // The intro paragraph is the paragraph that is NOT inside the contact list.
  const contactList = element.querySelector('.contact-items, [class*="contact-items"]');
  const introParagraph = Array.from(element.querySelectorAll('p')).find(
    (p) => !contactList || !contactList.contains(p),
  );

  // Build the left content cell.
  const leftCell = [];
  if (heading) leftCell.push(heading);
  if (introParagraph) leftCell.push(introParagraph);

  // Right column: the contact entries (H3 label + link/text value).
  const rightCell = [];
  if (contactList) {
    // Preserve the whole contact list container (holds all entries in order).
    rightCell.push(contactList);
  } else {
    // Fallback: gather any headings and links/paragraphs outside the left cell.
    const entryDivs = columnDivs.slice(1);
    entryDivs.forEach((div) => rightCell.push(...div.childNodes));
  }

  // Empty-block guard.
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([leftCell, rightCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
