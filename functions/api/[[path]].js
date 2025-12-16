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

// New function to handle user creation with D1
async function handleUserCreation(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { username, email, bio, profilePicture } = await request.json();

    // To use this function, you need to create a Cloudflare D1 database and bind it to this worker.
    // 1. Create a D1 database in your Cloudflare dashboard.
    // 2. Add the following to your wrangler.toml file:
    //    [[d1_databases]]
    //    binding = "DB" # i.e. env.DB
    //    database_name = "your-database-name"
    //    database_id = "your-database-id"
    // 3. Create a table in your D1 database with the following schema:
    //    CREATE TABLE users (
    //      id INTEGER PRIMARY KEY AUTOINCREMENT,
    //      username TEXT NOT NULL,
    //      email TEXT NOT NULL UNIQUE,
    //      bio TEXT,
    //      profile_picture TEXT
    //    );

    const { results } = await env.DB.prepare(
        "INSERT INTO users (username, email, bio, profile_picture) VALUES (?, ?, ?, ?)"
      )
      .bind(username, email, bio, profilePicture)
      .run();

    return new Response(JSON.stringify({ message: 'User created successfully', results }), {
      status: 201, // 201 Created
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ message: 'Error creating user', error: error.message }), {
      status: 400, // Bad Request
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // Route based on the path
    if (path === '/api/users') {
      return await handleUserCreation(request, env);
    } else {
      return await handleApiRequest(request, env);
    }
  } catch (e) {
    console.error(e.stack);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
