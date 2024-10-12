import { useEffect } from 'react';

function Translation({ word, onTranslate }) {
  useEffect(() => {
    if (word) {
      const fetchTranslation = async (searchWord) => {
        try {
          let translation;

          if (process.env.NODE_ENV === 'production') {
            // Use serverless function in production
            console.log('Fetching translation for:', searchWord);
            const response = await fetch(`/.netlify/functions/translate?word=${encodeURIComponent(searchWord)}`);
            console.log('Response status:', response.status);
            const text = await response.text();
            console.log('Raw response:', text);

            let data;
            try {
              data = JSON.parse(text);
              console.log('Parsed data:', data);
            } catch (error) {
              console.error('Error parsing JSON:', error);
              console.error('Raw response causing parse error:', text);
              throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
            }

            if (response.ok && data.translation) {
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

          console.log('Translation received:', translation);
          onTranslate(translation);
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