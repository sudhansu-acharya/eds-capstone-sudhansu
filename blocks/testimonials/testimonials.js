import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Testimonials Block
 * Repeats a set of testimonials, each with an avatar, a quote, and a name.
 *
 * Expected authored structure — one row per testimonial, 3 cells:
 *   Cell 1: avatar image
 *   Cell 2: the quote text
 *   Cell 3: the person's name (optionally followed by a role on a second line)
 *
 * Renders an unordered list of <figure> cards.
 */

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    const figure = document.createElement('figure');
    figure.className = 'testimonials-card';

    // Cell 1: avatar (optional)
    const avatarCell = cells[0];
    const avatarImg = avatarCell && avatarCell.querySelector('img');
    if (avatarImg) {
      const avatar = document.createElement('div');
      avatar.className = 'testimonials-avatar';
      avatar.append(avatarImg.closest('picture') || avatarImg);
      figure.append(avatar);
    }

    // Cell 2: quote (required)
    const quoteCell = cells[1];
    if (quoteCell) {
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'testimonials-quote';
      while (quoteCell.firstChild) blockquote.append(quoteCell.firstChild);
      figure.append(blockquote);
    }

    // Cell 3: name / attribution (optional)
    const nameCell = cells[2];
    if (nameCell && nameCell.textContent.trim()) {
      const caption = document.createElement('figcaption');
      caption.className = 'testimonials-name';
      while (nameCell.firstChild) caption.append(nameCell.firstChild);
      figure.append(caption);
    }

    li.append(figure);
    ul.append(li);
  });

  // optimize avatar images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
