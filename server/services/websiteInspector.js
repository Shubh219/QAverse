import { chromium } from 'playwright';

/**
 * Inspects a website using a headless Playwright browser.
 * Collects title, final URL, visible text, and relevant interactive elements
 * (links, buttons, inputs, forms) while enforcing strict length limits.
 *
 * @param {string} url - Target HTTP or HTTPS URL to inspect
 * @returns {Promise<Object>} Safe, structured website inspection metadata
 */
export async function inspectWebsite(url) {
  let browser = null;
  let context = null;
  let page = null;

  try {
    // 1. Launch headless Chromium with standard secure arguments
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 QAverse-Inspector/1.0'
    });

    page = await context.newPage();

    // Sensible navigation and execution timeouts
    page.setDefaultNavigationTimeout(20000); // 20s
    page.setDefaultTimeout(15000); // 15s

    // 2. Navigate to target URL
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000
    });

    // Brief stabilization wait for fonts & dynamic DOM
    await page.waitForTimeout(1000);

    const statusCode = response ? response.status() : 200;
    const finalUrl = page.url();
    const title = await page.title();

    // 3. Extract visible page elements & text safely inside the browser context
    const extractedData = await page.evaluate(() => {
      const clean = (str, max = 200) => (str || '').replace(/\s+/g, ' ').trim().slice(0, max);

      // Collect headings (up to 10)
      const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
        .slice(0, 10)
        .map((h) => ({
          tag: h.tagName.toLowerCase(),
          text: clean(h.innerText, 150)
        }))
        .filter((h) => h.text.length > 0);

      // Collect links (up to 20 unique links)
      const seenLinks = new Set();
      const links = [];
      const linkElements = Array.from(document.querySelectorAll('a[href]'));
      for (const el of linkElements) {
        if (links.length >= 20) break;
        const text = clean(el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '', 100);
        const href = el.getAttribute('href');
        if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
          const key = `${text}|${href}`;
          if (!seenLinks.has(key) && (text.length > 0 || href.length > 1)) {
            seenLinks.add(key);
            links.push({
              text: text || '(unlabeled link)',
              href: href.slice(0, 200)
            });
          }
        }
      }

      // Collect buttons (up to 20 buttons)
      const buttons = [];
      const buttonElements = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], [role="button"]'));
      for (const el of buttonElements) {
        if (buttons.length >= 20) break;
        const text = clean(el.innerText || el.value || el.getAttribute('aria-label') || '', 100);
        if (text) {
          buttons.push({
            text,
            type: el.getAttribute('type') || 'button'
          });
        }
      }

      // Collect inputs & interactive controls (up to 15 inputs)
      const inputs = [];
      const inputElements = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'));
      for (const el of inputElements) {
        if (inputs.length >= 15) break;
        const tag = el.tagName.toLowerCase();
        const type = el.getAttribute('type') || (tag === 'textarea' ? 'textarea' : tag === 'select' ? 'select' : 'text');
        const name = el.getAttribute('name') || el.id || '';
        const placeholder = el.getAttribute('placeholder') || '';
        const labelEl = el.labels && el.labels[0];
        const label = labelEl ? clean(labelEl.innerText, 100) : (el.getAttribute('aria-label') || '');
        inputs.push({
          type,
          name: name.slice(0, 50),
          placeholder: placeholder.slice(0, 100),
          label: label.slice(0, 100),
          required: el.hasAttribute('required')
        });
      }

      // Collect forms (up to 5 forms)
      const forms = Array.from(document.querySelectorAll('form'))
        .slice(0, 5)
        .map((form) => ({
          id: form.id || undefined,
          action: (form.getAttribute('action') || '').slice(0, 150),
          method: (form.getAttribute('method') || 'GET').toUpperCase(),
          fieldsCount: form.querySelectorAll('input, select, textarea').length
        }));

      // Visible body text (clean and capped to 5000 characters)
      const rawText = document.body ? document.body.innerText : '';
      const textSample = clean(rawText, 5000);

      return {
        headings,
        links,
        buttons,
        inputs,
        forms,
        textSample
      };
    });

    return {
      requestedUrl: url,
      finalUrl,
      title: title || 'Untitled Page',
      statusCode,
      inspectedAt: new Date().toISOString(),
      elements: extractedData
    };
  } catch (error) {
    const errorMsg = error.message || 'Unknown inspection error';
    throw new Error(`Failed to inspect website "${url}": ${errorMsg}`);
  } finally {
    // Reliably close page, context, and browser instance
    if (page) {
      await page.close().catch(() => {});
    }
    if (context) {
      await context.close().catch(() => {});
    }
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
