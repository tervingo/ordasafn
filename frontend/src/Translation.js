import { useEffect } from 'react';

function Translation({ word, onTranslate }) {
  useEffect(() => {
    if (word) {
      const fetchTranslation = async (searchWord) => {
        try {
          let translation;

          if (process.env.NODE_ENV === 'production') {
            // Use serverless function in production
            const response = await fetch(`/.netlify/functions/translate?word=${encodeURIComponent(searchWord)}`);
            const data = await response.json();
            
            if (response.ok) {
              translation = data.translation;
            } else {
              throw new Error(data.error || 'Translation not found');
            }
          } else {
            // Direct fetch for local development
            const response = await fetch(`https://is.glosbe.com/is/en/${encodeURIComponent(searchWord)}`);
            const html = await response.text();
            
            const regex = /<strong>(.+?)<\/strong> (?:is the translation|are the top translations) of/;
            const match = html.match(regex);
            
            if (match && match[1]) {
              translation = match[1];
            } else {
              throw new Error('Translation not found');
            }
          }

          onTranslate(translation);
        } catch (err) {
          console.error('Error fetching translation:', err);
          onTranslate('Failed to fetch translation');
        }
      };

      fetchTranslation(word);
    }
  }, [word, onTranslate]);

  return null; // This component doesn't render anything
}

export default Translation;