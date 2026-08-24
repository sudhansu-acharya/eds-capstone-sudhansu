import { createOptimizedPicture, readBlockConfig } from '../../scripts/aem.js';

/*
 * Article List Block
 * Reads the query index and renders cards, 10 at a time, with a "Load more" button.
 *
 * Optional authored config (key/value rows):
 *   - index:     path to the query index JSON (default: /query-index.json)
 *   - page-size: cards per page (default: 10)
 *   - filter:    only include entries whose `path` starts with this prefix (optional)
 *
 * Query-index rows are expected to expose (standard EDS shape):
 *   { path, title, description, image, lastModified, ... }
 */

const DEFAULT_INDEX = '/query-index.json';
const DEFAULT_PAGE_SIZE = 10;

async function fetchIndex(indexPath) {
  try {
    const resp = await fetch(indexPath);
    if (!resp.ok) return [];
    const json = await resp.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (e) {
    // network/parse failure — render nothing rather than throwing
    return [];
  }
}

function buildCard(item) {
  const li = document.createElement('li');
  const link = document.createElement('a');
  link.className = 'article-list-card';
  link.href = item.path || '#';

  if (item.image) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'article-list-card-image';
    imgWrap.append(createOptimizedPicture(item.image, item.title || '', false, [{ width: '750' }]));
    link.append(imgWrap);
  }

  const body = document.createElement('div');
  body.className = 'article-list-card-body';

  if (item.title) {
    const title = document.createElement('h3');
    title.textContent = item.title;
    body.append(title);
  }
  if (item.description) {
    const desc = document.createElement('p');
    desc.textContent = item.description;
    body.append(desc);
  }
  link.append(body);
  li.append(link);
  return li;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const indexPath = config.index || DEFAULT_INDEX;
  const pageSize = parseInt(config['page-size'], 10) || DEFAULT_PAGE_SIZE;
  const { filter } = config;

  block.textContent = '';

  let items = await fetchIndex(indexPath);
  if (filter) items = items.filter((it) => (it.path || '').startsWith(filter));

  const ul = document.createElement('ul');
  ul.className = 'article-list-cards';
  block.append(ul);

  let shown = 0;

  const optimize = (scope) => {
    scope.querySelectorAll('picture > img').forEach((img) => {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
    });
  };

  const renderNext = () => {
    const next = items.slice(shown, shown + pageSize);
    const frag = document.createDocumentFragment();
    next.forEach((item) => frag.append(buildCard(item)));
    ul.append(frag);
    optimize(ul);
    shown += next.length;
  };

  // empty state
  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'article-list-empty';
    empty.textContent = 'No articles found.';
    block.append(empty);
    return;
  }

  renderNext();

  // "Load more" button — only when there are more items than the first page
  if (shown < items.length) {
    const actions = document.createElement('div');
    actions.className = 'article-list-actions';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'article-list-load-more button';
    button.textContent = 'Load more';
    button.addEventListener('click', () => {
      renderNext();
      if (shown >= items.length) actions.remove();
      else button.focus();
    });
    actions.append(button);
    block.append(actions);
  }
}
