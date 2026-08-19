/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Library "Accordion" structure (2 columns, one row per item):
 *   Row 1: block name
 *   Row N: [ title cell, content cell ]
 *     Cell 1: question text (from <summary class="faq-question"> <span>)
 *     Cell 2: answer body (from <div class="faq-answer">)
 *
 * Source note: each item is a <details class="faq-item"> with a <summary>
 * containing the question <span> plus a decorative SVG icon (excluded).
 */
export default function parse(element, { document }) {
  // Each accordion item is a details.faq-item. Validated against source.html.
  let items = Array.from(
    element.querySelectorAll(':scope > details.faq-item, :scope > details'),
  );
  // Fallback: any details/faq-item descendant.
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('details.faq-item, details, .faq-item'));
  }

  const cells = [];

  items.forEach((item) => {
    // Title cell: question text from summary span (excludes decorative icon).
    const questionSpan = item.querySelector('summary .faq-question span, summary span');
    const summary = item.querySelector('summary.faq-question, summary');
    let titleCell = '';
    if (questionSpan) {
      titleCell = questionSpan;
    } else if (summary) {
      // Fallback: use summary text without the icon image.
      titleCell = summary.textContent.trim();
    }

    // Content cell: the answer body.
    const answer = item.querySelector('.faq-answer, [class*="answer"]');
    let contentCell = '';
    if (answer) {
      contentCell = answer;
    }

    if (titleCell || contentCell) {
      cells.push([titleCell, contentCell]);
    }
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
