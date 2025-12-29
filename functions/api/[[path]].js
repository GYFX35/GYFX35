import * as jose from 'jose';
import packageJson from '../../package.json';

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


async function handleAiAssistantRequest(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { message } = await request.json();
  if (!message) {
    return new Response('No message provided', { status: 400 });
  }

  const serviceAccount = JSON.parse(env.GCP_SERVICE_ACCOUNT);
  const accessToken = await getAccessToken(serviceAccount);

  const PROJECT_ID = env.PROJECT_ID;
  const LOCATION = env.LOCATION || 'us-central1';
  const MODEL_ID = env.MODEL_ID || 'gemini-1.0-pro-001';

  // Specialized prompt for the AI Assistant
  const prompt = `You are an expert assistant for the "Global Peace, Youth Entrepreneurship, and Wellbeing Platform." Your expertise now includes medicine, education, generative AI, consulting, and marketing. Your goal is to provide helpful and inspiring information on these topics. Please answer the following user query in a clear, concise, and encouraging way:\n\nUser: "${message}"\n\nAssistant:`;

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

  // Handle cases where the response might be empty or malformed
  if (!responseBody.candidates || !responseBody.candidates[0] || !responseBody.candidates[0].content || !responseBody.candidates[0].content.parts || !responseBody.candidates[0].content.parts[0]) {
      console.error('Malformed API Response:', responseBody);
      return new Response(JSON.stringify({ error: 'Received a malformed response from the AI.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
  }

  const responseText = responseBody.candidates[0].content.parts[0].text;

  return new Response(JSON.stringify({ response: responseText }), {
    headers: { 'Content-Type': 'application/json' },
  });
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

async function handleDevOpsRequest(request, env) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const version = packageJson.version;
  const status = 'ok';

  const responseData = {
    version,
    status,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleVideoSubmission(request, env) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { title, url, description } = await request.json();

        // Instructions for the user:
        // 1. Make sure you have a D1 database bound to this worker as `env.DB`.
        // 2. Create a 'videos' table with the following schema:
        //    CREATE TABLE videos (
        //      id INTEGER PRIMARY KEY AUTOINCREMENT,
        //      title TEXT NOT NULL,
        //      url TEXT NOT NULL,
        //      description TEXT,
        //      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        //    );

        const { results } = await env.DB.prepare(
            "INSERT INTO videos (title, url, description) VALUES (?, ?, ?)"
        )
        .bind(title, url, description)
        .run();

        return new Response(JSON.stringify({ message: 'Video submitted successfully', results }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error submitting video:', error);
        return new Response(JSON.stringify({ message: 'Error submitting video', error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleGetVideos(request, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { results } = await env.DB.prepare("SELECT * FROM videos ORDER BY submitted_at DESC").all();
        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
        return new Response(JSON.stringify({ message: 'Error fetching videos', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleEntrepreneurshipData(request, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    const entrepreneurshipData = {
        title: "Erasmus for Young Entrepreneurs Statistics",
        totalExchanges: 12678,
        topDestinationCountries: [
            { country: "Spain", exchanges: 2564 },
            { country: "Italy", exchanges: 1515 },
            { country: "Germany", exchanges: 1315 },
            { country: "Netherlands", exchanges: 786 },
            { country: "Belgium", exchanges: 710 }
        ],
        topOriginCountries: [
            { country: "Italy", entrepreneurs: 2537 },
            { country: "Spain", entrepreneurs: 2085 },
            { country: "Poland", entrepreneurs: 698 },
            { country: "Greece", entrepreneurs: 611 },
            { country: "Romania", entrepreneurs: 583 }
        ]
    };

    return new Response(JSON.stringify(entrepreneurshipData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

async function handleGbifRequest(request, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);
    // Proxying search requests to GBIF occurrence API
    const gbifApiUrl = `https://api.gbif.org/v1/occurrence/search${url.search}`;

    try {
        const gbifResponse = await fetch(gbifApiUrl, {
            headers: {
                'User-Agent': 'GPW-Platform-Agent/1.0' // Good practice to set a User-Agent
            }
        });

        // Create a new response passing through the body, status, and headers from GBIF.
        const response = new Response(gbifResponse.body, gbifResponse);

        // Add CORS headers to the response to allow the frontend to access it
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return response;

    } catch (error) {
        console.error('Error fetching from GBIF API:', error);
        return new Response(JSON.stringify({ message: 'Error proxying request to GBIF API', error: error.message }), {
            status: 500,
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
    if (path === '/api/ai') {
      return await handleAiAssistantRequest(request, env);
    }
    if (path === '/api/devops') {
      return await handleDevOpsRequest(request, env);
    }
    if (path.startsWith('/api/gbif')) {
        return await handleGbifRequest(request, env);
    }
    if (path === '/api/entrepreneurship') {
      return await handleEntrepreneurshipData(request, env);
    }
    if (path === '/api/users') {
      return await handleUserCreation(request, env);
    } else if (path === '/api/videos') {
        if (request.method === 'GET') {
            return await handleGetVideos(request, env);
        } else if (request.method === 'POST') {
            return await handleVideoSubmission(request, env);
        }
    }
    else {
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
