
import * as jose from 'jose';

// Global cache for the access token
let tokenCache = {
  accessToken: null,
  expiresAt: 0, // Expiration time in milliseconds
};

async function getAccessToken(serviceAccount) {
  const now = Date.now();
  // Check if token exists and is not about to expire (with a 60-second buffer)
  if (tokenCache.accessToken && now < tokenCache.expiresAt - 60000) {
    return tokenCache.accessToken;
  }

  const privateKey = await jose.importPKCS8(serviceAccount.private_key, 'RS256');

  const jwt = await new jose.SignJWT({
    scope: 'https://www.googleapis.com/auth/cloud-platform',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(serviceAccount.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setExpirationTime('1h')
    .setIssuedAt()
    .sign(privateKey);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch access token: ${tokenData.error_description || response.statusText}`);
  }

  const { access_token, expires_in } = tokenData;

  // Cache the new token and its expiration time
  tokenCache = {
    accessToken: access_token,
    expiresAt: Date.now() + (expires_in * 1000),
  };

  return access_token;
}


async function handleApiRequest(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { message, idea } = await request.json();
  const serviceAccount = JSON.parse(env.GCP_SERVICE_ACCOUNT);
  const accessToken = await getAccessToken(serviceAccount);

  const PROJECT_ID = env.PROJECT_ID;
  const LOCATION = env.LOCATION || 'us-central1';
  const MODEL_ID = env.MODEL_ID || 'gemini-1.0-pro-001';

  let prompt;
  if (idea) {
    prompt = `Provide feedback on the following business idea: ${idea}`;
  } else if (message) {
    prompt = message;
  } else {
    return new Response('No message or idea provided', { status: 400 });
  }

  const apiUrl = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:generateContent`;

  const apiRequest = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  const apiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiRequest),
  });

  const responseBody = await apiResponse.json();

  if (!apiResponse.ok) {
    console.error('API Error:', responseBody);
    const errorDetails = responseBody.error?.message || 'Unknown error from API';
    return new Response(JSON.stringify({ error: `API request failed: ${errorDetails}` }), {
      status: apiResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const responseText = responseBody.candidates[0].content.parts[0].text;

  return new Response(JSON.stringify({ response: responseText }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleVideoSubmission(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { title, url } = await request.json();
    console.log('Received video submission:', { title, url });

    // For now, we just acknowledge receipt. A database would be used in a real application.
    return new Response(JSON.stringify({ message: 'Video submitted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling video submission:', error);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  try {
    if (url.pathname === '/api/videos') {
      return await handleVideoSubmission(request);
    }

    // Fallback to the existing API handler for other routes
    return await handleApiRequest(request, env);
  } catch (e) {
    console.error(e.stack);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
