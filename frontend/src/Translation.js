import { useEffect, useState, useCallback, useMemo } from 'react';

function Translation({ word, onTranslate }) {
  const [currentProxyIndex, setCurrentProxyIndex] = useState(0);
    
  const corsProxies = useMemo(() => [
    {
      url: 'https://api.codetabs.com/v1/proxy?quest=',
      encode: true
    },
    {
      url: 'https://cors-anywhere.herokuapp.com/',
      encode: false
    }
  ], []); // Empty dependency array since this is static data

  const fetchWithProxy = useCallback(async (searchWord, proxyConfig) => {
    try {
      const glosbeUrl = `https://is.glosbe.com/is/en/${encodeURIComponent(searchWord)}`;
      const finalUrl = proxyConfig.encode 
        ? proxyConfig.url + encodeURIComponent(glosbeUrl)
        : proxyConfig.url + glosbeUrl;

      const response = await fetch(finalUrl, {
        headers: {
          'Origin': 'https://is.glosbe.com',
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          ...proxyConfig.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.text();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }, []);

  const extractTranslations = useCallback((html) => {
    console.log('Extracting from HTML slice:', html.slice(0, 500));  // Debug log

    // First try the strong tag patterns
    const strongPatterns = [
      /<strong>([^<]+)<\/strong>\s+(?:is the translation|are the top translations) of/,
      /<strong>([^<]+)<\/strong>/
    ];

    for (const pattern of strongPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const translations = match[1]
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0);

        if (translations.length > 0) {
          console.log('Found translations with strong pattern:', translations);
          return translations;
        }
      }
    }

    // If strong patterns fail, try direct translation class patterns
    const translationPatterns = [
      /<div[^>]*class="translation[^"]*"[^>]*>([^<]+)<\/div>/gi,
      /<span[^>]*class="translation[^"]*"[^>]*>([^<]+)<\/span>/gi
    ];

    for (const pattern of translationPatterns) {
      const matches = Array.from(html.matchAll(pattern));
      if (matches.length > 0) {
        const translations = matches
          .map(match => match[1].trim())
          .filter(t => t.length > 0);

        if (translations.length > 0) {
          console.log('Found translations with class pattern:', translations);
          return translations;
        }
      }
    }

    // Check for no translations message
    if (html.includes('No translations found')) {
      throw new Error('No translation available');
    }

    throw new Error('Translation pattern not found');
  }, []);

  useEffect(() => {
    if (!word) return;

    const fetchTranslation = async () => {
      let lastError;

      for (let i = currentProxyIndex; i < corsProxies.length; i++) {
        try {
          console.log(`Attempting proxy ${i}:`, corsProxies[i].url);
          const html = await fetchWithProxy(word, corsProxies[i]);
          
          const translations = extractTranslations(html);
          console.log('Successfully found translations:', translations);
          
          onTranslate(translations.join(', '));
          
          if (i !== currentProxyIndex) {
            setCurrentProxyIndex(i);
          }
          return;

        } catch (err) {
          console.warn(`Proxy ${i} failed:`, err.message);
          lastError = err;
          
          if (err.message === 'No translation available') {
            onTranslate('No translation available');
            return;
          }
        }
      }

      console.error('All proxies failed. Last error:', lastError);
      onTranslate(`Translation failed: ${lastError.message}`);
      setCurrentProxyIndex(0);
    };

    fetchTranslation();
  }, [word, onTranslate, currentProxyIndex, corsProxies, fetchWithProxy, extractTranslations]);

  return null;
}

export default Translation;