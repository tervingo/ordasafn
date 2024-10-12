const axios = require('axios');

exports.handler = async function(event, context) {
  const { word } = event.queryStringParameters;
  
  if (!word) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Word parameter is required' })
    };
  }

  try {
    console.log(`Fetching translation for: ${word}`);
    const response = await axios.get(`https://is.glosbe.com/is/en/${encodeURIComponent(word)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = response.data;
    
    // Extract the translation
    const regex = /<strong>(.+?)<\/strong> (?:is the translation|are the top translations) of/;
    const match = html.match(regex);
    
    if (match && match[1]) {
      console.log(`Translation found: ${match[1]}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ translation: match[1] })
      };
    } else {
      console.log('Translation not found in the response');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Translation not found' })
      };
    }
  } catch (error) {
    console.error('Error in serverless function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch translation', details: error.message })
    };
  }
};