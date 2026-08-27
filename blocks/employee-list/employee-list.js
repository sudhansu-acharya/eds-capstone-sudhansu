import { createOptimizedPicture, readBlockConfig } from '../../scripts/aem.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';

/*
 * Employee List Block
 * Reads a published spreadsheet and renders employee cards, 10 at a time,
 * with a "Load more" button whose label comes from the placeholders sheet.
 *
 * Optional authored config (key/value rows):
 *   - index:     path to the employees JSON (default: /employees.json)
 *   - page-size: cards per page (default: 10)
 *
 * Sheet rows are expected to expose: name, title, department, image
 */

const DEFAULT_INDEX = '/employees.json';
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
  li.className = 'employee-list-card';

  if (item.image) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'employee-list-card-image';
    imgWrap.append(createOptimizedPicture(item.image, item.name || '', false, [{ width: '300' }]));
    li.append(imgWrap);
  }

  const body = document.createElement('div');
  body.className = 'employee-list-card-body';

  if (item.name) {
    const name = document.createElement('h3');
    name.textContent = item.name;
    body.append(name);
  }
  if (item.title) {
    const title = document.createElement('p');
    title.className = 'employee-list-card-title';
    title.textContent = item.title;
    body.append(title);
  }
  if (item.department) {
    const department = document.createElement('p');
    department.className = 'employee-list-card-department';
    department.textContent = item.department;
    body.append(department);
  }

  li.append(body);
  return li;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const indexPath = config.index || DEFAULT_INDEX;
  const pageSize = parseInt(config['page-size'], 10) || DEFAULT_PAGE_SIZE;

  block.textContent = '';

  const [items, placeholders] = await Promise.all([
    fetchIndex(indexPath),
    fetchPlaceholders(),
  ]);

  const ul = document.createElement('ul');
  ul.className = 'employee-list-cards';
  block.append(ul);

  let shown = 0;

  const optimize = (scope) => {
    scope.querySelectorAll('picture > img').forEach((img) => {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '300' }]));
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

  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'employee-list-empty';
    empty.textContent = 'No employees found.';
    block.append(empty);
    return;
  }

  renderNext();

  if (shown < items.length) {
    const actions = document.createElement('div');
    actions.className = 'employee-list-actions';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'employee-list-load-more button';
    button.textContent = placeholders.loadMore || 'Load more';
    button.addEventListener('click', () => {
      renderNext();
      if (shown >= items.length) actions.remove();
      else button.focus();
    });
    actions.append(button);
    block.append(actions);
  }
}
