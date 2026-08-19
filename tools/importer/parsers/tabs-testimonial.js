/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base block: tabs.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-19
 *
 * Library "Tabs" structure (2 columns, one row per tab):
 *   Row 1: block name
 *   Row N: [ tab label cell, tab content cell ]
 *     Cell 1: tab label (avatar image + name + role)
 *     Cell 2: tab panel content (testimonial image + name + role + quote)
 *
 * Source note: labels live in `.tab-menu > button.tab-menu-link` and panels
 * live in `.tabs-content > .tab-pane`. They are paired by document order/index.
 */
export default function parse(element, { document }) {
  // Tab labels (menu buttons). Validated against source.html.
  const labels = Array.from(
    element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button'),
  );
  // Tab panels (content panes).
  const panels = Array.from(
    element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'),
  );

  const cells = [];
  const count = Math.max(labels.length, panels.length);

  for (let i = 0; i < count; i += 1) {
    const label = labels[i];
    const panel = panels[i];

    // Label cell: use inner content of the button (avatar + name + role).
    const labelCell = [];
    if (label) {
      const labelInner = label.querySelector(':scope > div') || label;
      labelCell.push(labelInner);
    }

    // Content cell: use the panel's inner grid (image + text) or the panel itself.
    const contentCell = [];
    if (panel) {
      const panelInner = panel.querySelector(':scope > .grid-layout') || panel;
      contentCell.push(panelInner);
    }

    if (labelCell.length > 0 || contentCell.length > 0) {
      cells.push([labelCell, contentCell]);
    }
  }

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
