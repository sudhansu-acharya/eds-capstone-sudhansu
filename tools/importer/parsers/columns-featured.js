/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base block: columns.
 * Source: https://wknd-trendsetters.site/blog
 * Generated: 2026-08-19
 *
 * Library structure (flexible columns):
 *   Row 1: block name
 *   Row 2: one cell per visual column. Source groups content into 2 columns:
 *     Col 1: cover image
 *     Col 2: tag + date, heading, paragraph, CTA(s)
 */
export default function parse(element, { document }) {
  // The two visual columns are the direct child <div>s of the grid.
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // INPUT EXTRACTION — validated against source.html
  // Image column: the cover image.
  const image = element.querySelector('img.cover-image, img[class*="cover"], img');

  // Content column: prefer the div that is NOT the image wrapper.
  let contentDiv = columnDivs.find((div) => !div.querySelector('img'));
  if (!contentDiv) {
    contentDiv = columnDivs[columnDivs.length - 1] || element;
  }

  // Build the image cell.
  const imageCell = [];
  if (image) imageCell.push(image);

  // Build the content cell from the content div's children.
  const contentCell = [];

  // Meta row: tag + date (flex-horizontal group).
  const metaGroup = contentDiv.querySelector('.flex-horizontal, [class*="flex-horizontal"]');
  if (metaGroup) contentCell.push(metaGroup);

  // Heading.
  const heading = contentDiv.querySelector('h1, h2, h3, [class*="heading"]');
  if (heading) contentCell.push(heading);

  // Paragraph(s) that are not inside the meta group.
  const paragraphs = Array.from(contentDiv.querySelectorAll('p')).filter(
    (p) => !metaGroup || !metaGroup.contains(p),
  );
  contentCell.push(...paragraphs);

  // CTA(s).
  const ctaLinks = Array.from(
    contentDiv.querySelectorAll('.button-group a, a.button, a[class*="button"]'),
  );
  contentCell.push(...ctaLinks);

  // Empty-block guard.
  if (imageCell.length === 0 && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([imageCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
