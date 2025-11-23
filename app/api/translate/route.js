// app/api/translate/route.js

export async function POST(request) {
  // Ensure the request's Content-Type is application/json
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(
      JSON.stringify({ error: 'Invalid Content-Type. Expected application/json' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  let data;
  try {
    data = await request.json();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { text, targetLanguage } = data;

  // Validate required fields
  if (!text || !targetLanguage) {
    return new Response(JSON.stringify({ error: 'Missing text or targetLanguage' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const apiUrl = process.env.GOOGLE_TRANSLATE_API_URL;

  // Validate environment variables
  if (!apiKey || !apiUrl) {
    console.error('Translation API key or URL not configured');
    return new Response(
      JSON.stringify({ error: 'Translation API key or URL not configured' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Construct the full API URL with query parameters
    const url = `${apiUrl}?key=${apiKey}`;

    // Make the POST request to Google Translation API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: 'text', // Optional: 'text' or 'html'
      }),
    });

    // Check if the response is not OK
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Translate API error:', errorData);
      return new Response(
        JSON.stringify({ error: errorData.error.message || 'Translation failed' }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const responseData = await response.json();

    // Extract the translated text
    const translatedText = responseData.data.translations[0].translatedText;

    return new Response(JSON.stringify({ text: translatedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error translating text:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
