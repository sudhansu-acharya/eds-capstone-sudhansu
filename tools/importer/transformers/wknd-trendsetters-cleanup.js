/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable site chrome. All selectors verified against
 * migration-work/cleaned.html.
 *
 * Verified in cleaned.html:
 *   - <a href="#main-content" class="skip-link">   (skip link, before navbar)
 *   - <div class="navbar"> ... </div>              (global top navigation, before <main>)
 *   - <footer class="footer inverse-footer"> ...    (global footer, after <main>)
 *
 * NOTE: <header class="section secondary-section"> lives INSIDE #main-content and
 * is authorable hero content — it is intentionally NOT removed. We target the
 * site nav via `.navbar` and the site footer via `footer`, not `header`.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (selectors from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',   // "Skip to main content"
      '.navbar',       // global top navigation / mega menu
      'footer',        // global site footer (only footer on the page)
    ]);
  }
}
