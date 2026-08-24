/*
 * Quote Block
 * Renders a pull-quote with an attribution line.
 *
 * Expected authored structure (2 rows):
 *   Row 1: the quotation text (required)
 *   Row 2: the attribution — e.g. "Alex Rivera, Streetwear Enthusiast" (optional)
 */

export default function decorate(block) {
  const rows = [...block.children];
  const quoteRow = rows[0];
  const attributionRow = rows[1];

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'quote-text';
  if (quoteRow) {
    // move the quotation content (unwrapping the row/cell wrappers)
    const cell = quoteRow.querySelector(':scope > div') || quoteRow;
    while (cell.firstChild) blockquote.append(cell.firstChild);
  }

  const figure = document.createElement('figure');
  figure.append(blockquote);

  if (attributionRow) {
    const cell = attributionRow.querySelector(':scope > div') || attributionRow;
    const text = cell.textContent.trim();
    if (text) {
      const caption = document.createElement('figcaption');
      caption.className = 'quote-attribution';
      const cite = document.createElement('cite');
      // preserve any inline markup (e.g. a link) authored in the attribution
      while (cell.firstChild) cite.append(cell.firstChild);
      caption.append(cite);
      figure.append(caption);
    }
  }

  block.replaceChildren(figure);
}
