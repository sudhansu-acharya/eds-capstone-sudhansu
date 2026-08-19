/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBlogParser from './parsers/hero-blog.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroCtaParser from './parsers/hero-cta.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Homepage: hero, featured case study, image gallery, testimonials (tabs), latest articles cards, FAQ (accordion), and case study CTA',
  urls: [
    'https://wknd-trendsetters.site/',
  ],
  blocks: [
    {
      name: 'hero-blog',
      instances: ['#main-content > header.section.secondary-section .grid-layout.grid-gap-xxl'],
    },
    {
      name: 'columns-featured',
      instances: ['#main-content > section.section:nth-of-type(1) .grid-layout.grid-gap-lg'],
    },
    {
      name: 'cards-gallery',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm'],
    },
    {
      name: 'tabs-testimonial',
      instances: ['#main-content > section.section:nth-of-type(3) .tabs-wrapper'],
    },
    {
      name: 'cards-article',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md'],
    },
    {
      name: 'accordion-faq',
      instances: ['#main-content > section.section:nth-of-type(5) .faq-list'],
    },
    {
      name: 'hero-cta',
      instances: ['#main-content > section.section.inverse-section .grid-layout.desktop-1-column'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'Hero', selector: '#main-content > header.section.secondary-section', style: 'secondary', blocks: ['hero-blog'], defaultContent: [] },
    { id: 'section-2', name: 'Featured case study', selector: '#main-content > section.section:nth-of-type(1)', style: null, blocks: ['columns-featured'], defaultContent: [] },
    { id: 'section-3', name: 'Image gallery', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'secondary', blocks: ['cards-gallery'], defaultContent: [] },
    { id: 'section-4', name: 'Testimonials', selector: '#main-content > section.section:nth-of-type(3)', style: null, blocks: ['tabs-testimonial'], defaultContent: [] },
    { id: 'section-5', name: 'Latest articles', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'secondary', blocks: ['cards-article'], defaultContent: [] },
    { id: 'section-6', name: 'FAQ', selector: '#main-content > section.section:nth-of-type(5)', style: null, blocks: ['accordion-faq'], defaultContent: [] },
    { id: 'section-7', name: 'Case study CTA', selector: '#main-content > section.section.inverse-section', style: 'inverse', blocks: ['hero-cta'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-blog': heroBlogParser,
  'columns-featured': columnsFeaturedParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-cta': heroCtaParser,
};

// TRANSFORMER REGISTRY - cleanup first; section transformer after (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - DOM document
 * @param {Object} template - embedded PAGE_TEMPLATE
 * @returns {Array} block instances found
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by a prior parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index to avoid empty-path crash)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
