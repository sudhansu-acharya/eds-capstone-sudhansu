/*
 * Banner Block
 * Displays an image with an overlaid title over a background color.
 *
 * Expected authored structure (3 rows):
 *   Row 1: image (required)
 *   Row 2: title text (required)
 *   Row 3: background color, e.g. "blue" or "#1a73e8" (optional — defaults to blue)
 *
 * Variants:
 *   Banner (dark) — swaps the default background for a dark shade. An explicitly
 *   authored row-3 color still wins over either default.
 */

const DEFAULT_BACKGROUND = 'blue';

// TODO: pick the exact dark-variant shade (hex/CSS color).
const DARK_BACKGROUND = '#1a1a1a';

/**
 * Resolves the author-supplied color text into a value to assign to
 * el.style.backgroundColor. Accepts any CSS color the author types; an
 * empty/missing value returns undefined so the caller's variant-aware
 * default (blue, or dark for the `dark` variant) takes over.
 *
 * @param {string} colorText raw text authored in the color row (may be empty)
 * @returns {string|undefined} a CSS color value, or undefined if none authored
 */
function resolveBackgroundColor(colorText) {
  return colorText || undefined;
}

export default function decorate(block) {
  const [imageRow, titleRow, colorRow] = [...block.children];

  const picture = imageRow?.querySelector('picture');
  const titleCell = titleRow?.querySelector(':scope > div') || titleRow;
  const colorText = colorRow?.textContent.trim();

  const isDark = block.classList.contains('dark');
  const fallbackBackground = isDark ? DARK_BACKGROUND : DEFAULT_BACKGROUND;

  const inner = document.createElement('div');
  inner.className = 'banner-inner';
  inner.style.backgroundColor = resolveBackgroundColor(colorText) || fallbackBackground;

  if (picture) inner.append(picture);

  const title = document.createElement('div');
  title.className = 'banner-title';
  while (titleCell?.firstChild) title.append(titleCell.firstChild);
  inner.append(title);

  block.replaceChildren(inner);
}
