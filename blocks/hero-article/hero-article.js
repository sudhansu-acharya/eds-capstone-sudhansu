/**
 * hero-article -- two-column article masthead (cover image + header text).
 * DOM: row 1 = cover image, row 2 = content (breadcrumbs, title, byline,
 * date/read-time, category tag). If no image is authored, fall back to a
 * single-column, text-only header.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }
}
