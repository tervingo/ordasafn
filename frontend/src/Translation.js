import { useEffect } from 'react';

function Translation({ word, onTranslate }) {
  useEffect(() => {
    if (word) {
      const fetchTranslation = async (searchWord) => {
        try {
          const corsProxy = 'https://corsproxy.io/?';
          const glosbeUrl = `https://is.glosbe.com/is/en/${encodeURIComponent(searchWord)}`;
          const response = await fetch(corsProxy + encodeURIComponent(glosbeUrl));
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const html = await response.text();
          
          // Extract the translation
          const regex = /<strong>(.+?)<\/strong> (?:is the translation|are the top translations) of/;
          const match = html.match(regex);
          
          if (match && match[1]) {
            console.log('Translation found:', match[1]);
            onTranslate(match[1]);
          } else {
            throw new Error('Translation not found');
          }
        } catch (err) {
          console.error('Error fetching translation:', err);
          onTranslate(`Failed to fetch translation: ${err.message}`);
        }
      };

      fetchTranslation(word);
    }
  }, [word, onTranslate]);

  return null; // This component doesn't render anything
}

export default Translation;