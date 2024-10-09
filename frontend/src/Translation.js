import { useEffect } from 'react';

function Translation({ word, onTranslate }) {
  useEffect(() => {
    if (word) {
      fetchTranslation(word);
    }
  }, [word, onTranslate]);

  const fetchTranslation = async (searchWord) => {
    try {
      const response = await fetch(`https://is.glosbe.com/is/en/${searchWord}`);
      const html = await response.text();
      
      // Extract the translation
      const regex = /<strong>(.+?)<\/strong> (?:is the translation|are the top translations) of/;
      const match = html.match(regex);
      
      if (match && match[1]) {
        onTranslate(match[1]);
      } else {
        onTranslate('Translation not found');
      }
    } catch (err) {
      console.error('Error fetching translation:', err);
      onTranslate('Failed to fetch translation');
    }
  };

  return null; // This component doesn't render anything
}

export default Translation;