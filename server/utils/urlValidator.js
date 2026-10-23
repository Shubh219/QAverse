/**
 * Utility to validate whether a given string is a valid HTTP or HTTPS URL.
 * 
 * @param {string} urlString - The URL string to test.
 * @returns {boolean} True if the string is a valid HTTP or HTTPS URL, false otherwise.
 */
export function isValidHttpUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
