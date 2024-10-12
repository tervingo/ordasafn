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
    const response = await axios.get(`https://is.glosbe.com/is/en/${encodeURIComponent(word)}`);
    const html = response.data;
    
    // Extract the translation
    const regex = /<strong>(.+?)<\/strong> (?:is the translation|are the top translations) of/;
    const match = html.match(regex);
    
    if (match && match[1]) {
      return {
        statusCode: 200,
        body: JSON.stringify({ translation: match[1] })
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Translation not found' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch translation' })
    };
  }
};