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


async function handleGoogleSearchRequest(request, env) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { query } = await request.json();
        if (!query) {
            return new Response('No query provided', { status: 400 });
        }

        const API_KEY = env.GOOGLE_API_KEY;
        const SEARCH_ENGINE_ID = env.GOOGLE_SEARCH_ENGINE_ID;

        if (!API_KEY || !SEARCH_ENGINE_ID) {
            return new Response('API credentials not configured on the server', { status: 500 });
        }

        const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;

        const apiResponse = await fetch(url);
        const responseData = await apiResponse.json();

        if (!apiResponse.ok) {
            console.error('Google Search API Error:', responseData);
            return new Response(JSON.stringify({ error: 'Failed to fetch search results' }), {
                status: apiResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(responseData), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in handleGoogleSearchRequest:', error);
        return new Response(JSON.stringify({ error: 'Something went wrong' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleOxfamRequest(request, env) {
  const oxfamData = await import('../../frontend/oxfam_data.json');
  return new Response(JSON.stringify(oxfamData.default), {
    headers: { 'Content-Type': 'application/json' },
  });
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
  const prompt = `You are an expert assistant for the "Global Peace, Youth Entrepreneurship, and Wellbeing Platform." Your expertise now includes medicine, education, generative AI, consulting, marketing, software engineering, design, data analytics, business strategy, GPS, maps, video prototype development, video content creation, and prompt concretization. Your goal is to provide helpful and inspiring information on these topics. Please answer the following user query in a clear, concise, and encouraging way:\n\nUser: "${message}"\n\nAssistant:`;

  const apiUrl = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}:generateContent`;

  const apiRequest = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    tools: [{
      "googleSearchRetrieval": {}
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

async function handleGetMedia(request, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { results } = await env.DB.prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all();
        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        return new Response(JSON.stringify({ message: 'Error fetching media', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleMediaUpload(request, env) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('media');
        // WARNING: This is a security vulnerability.
        // In a production environment, you must replace this hardcoded user ID
        // with the actual user ID from a secure authentication system (e.g., JWT, session).
        const userId = 1;

        if (!file) {
            return new Response('No file uploaded', { status: 400 });
        }

        const fileName = `${Date.now()}_${file.name}`;
        await env.R2.put(fileName, file.stream(), {
            httpMetadata: { contentType: file.type },
        });

        const mediaType = file.type.startsWith('image/') ? 'photo' : 'video';
        await env.DB.prepare(
            'INSERT INTO media (user_id, media_type, file_name) VALUES (?, ?, ?)'
        )
        .bind(userId, mediaType, fileName)
        .run();

        return new Response(JSON.stringify({ message: 'File uploaded successfully', fileName }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return new Response(JSON.stringify({ message: 'Error uploading file', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handlePostSubmission(request, env) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { title, content } = await request.json();

        // 1. Make sure you have a D1 database bound to this worker as `env.DB`.
        // 2. Create a 'posts' table with the following schema:
        //    CREATE TABLE posts (
        //      id INTEGER PRIMARY KEY AUTOINCREMENT,
        //      title TEXT NOT NULL,
        //      content TEXT NOT NULL,
        //      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        //    );

        const { results } = await env.DB.prepare(
            "INSERT INTO posts (title, content) VALUES (?, ?)"
        )
        .bind(title, content)
        .run();

        return new Response(JSON.stringify({ message: 'Post submitted successfully', results }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error submitting post:', error);
        return new Response(JSON.stringify({ message: 'Error submitting post', error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleGetPosts(request, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { results } = await env.DB.prepare("SELECT * FROM posts ORDER BY submitted_at DESC").all();
        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return new Response(JSON.stringify({ message: 'Error fetching posts', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleGetVideos(request, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    const fetchVideosFromYouTube = async () => {
        const YOUTUBE_API_KEY = env.YOUTUBE_API_KEY;
        const PLAYLIST_ID = env.YOUTUBE_PLAYLIST_ID;
        const maxResults = 10;
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`YouTube API Error: ${response.status} ${response.statusText}`, errorBody);
                throw new Error(`Failed to fetch videos from YouTube: ${response.statusText}`);
            }
            const data = await response.json();
            // Handle cases where 'items' might be missing from the response
            if (!data.items) {
                console.error('YouTube API response missing "items" array:', data);
                return [];
            }
            return data.items.map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                thumbnail: item.snippet.thumbnails.high.url, // Extract high-quality thumbnail
                description: item.snippet.description,
                source: 'youtube'
            }));
        } catch (error) {
            console.error('Error fetching from YouTube:', error);
            return []; // Return empty array on error to avoid breaking the entire response
        }
    };

    try {
        // 1. Check D1 cache first
        const { results } = await env.DB.prepare("SELECT * FROM videos ORDER BY submitted_at DESC").all();

        if (results && results.length > 0) {
            // 2. Return cached data if available
            return new Response(JSON.stringify(results), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 3. If cache is empty, fetch from YouTube
        const youtubeVideos = await fetchVideosFromYouTube();

        if (youtubeVideos.length > 0) {
            // 4. Store new data in the database
            // NOTE: This assumes the 'videos' table has 'thumbnail' and 'source' columns.
            const stmt = env.DB.prepare("INSERT INTO videos (title, url, description, thumbnail, source) VALUES (?, ?, ?, ?, ?)");
            const inserts = youtubeVideos.map(video => stmt.bind(video.title, video.url, video.description, video.thumbnail, video.source));
            await env.DB.batch(inserts);
        }

        // 5. Return the fresh data
        return new Response(JSON.stringify(youtubeVideos), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in handleGetVideos with D1:', error);
        // Fallback to fetching directly from YouTube if the database logic fails
        try {
            const youtubeVideos = await fetchVideosFromYouTube();
            return new Response(JSON.stringify(youtubeVideos), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (youtubeError) {
             console.error('Fallback YouTube fetch also failed:', youtubeError);
             return new Response(JSON.stringify({ message: 'Error fetching videos from all sources', error: youtubeError.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
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


async function handleStatusRequest(request) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const responseData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}


async function handleWhoRequest(request) {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace('/api/who/', '');
    const apiQuery = url.search;
    const whoApiUrl = `https://ghoapi.azureedge.net/api/${apiPath}${apiQuery}`;

    try {
        const whoResponse = await fetch(whoApiUrl);
        const response = new Response(whoResponse.body, whoResponse);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        return response;
    } catch (error) {
        console.error('Error fetching from WHO API:', error);
        return new Response(JSON.stringify({ message: 'Error proxying request to WHO API', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


async function handleCiscoRequest(request, env, api) {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace(`/api/cisco/${api}/`, '');
    const apiQuery = url.search;

    let baseUrl, apiKey;
    const headers = {
        'Content-Type': 'application/json'
    };

    if (api === 'webex') {
        baseUrl = 'https://webexapis.com/v1';
        apiKey = env.CISCO_WEBEX_API_KEY;
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }
    } else if (api === 'meraki') {
        baseUrl = 'https://api.meraki.com/api/v1';
        apiKey = env.CISCO_MERAKI_API_KEY;
        if (apiKey) {
            headers['X-Cisco-Meraki-API-Key'] = apiKey;
        }
    } else {
        return new Response('Invalid Cisco API specified', { status: 400 });
    }

    if (!apiKey) {
        return new Response(`API key for Cisco ${api} not configured`, { status: 500 });
    }

    const ciscoApiUrl = `${baseUrl}/${apiPath}${apiQuery}`;

    try {
        const ciscoResponse = await fetch(ciscoApiUrl, {
            headers: headers
        });

        const response = new Response(ciscoResponse.body, ciscoResponse);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Cisco-Meraki-API-Key');

        return response;
    } catch (error) {
        console.error(`Error fetching from Cisco ${api} API:`, error);
        return new Response(JSON.stringify({ message: `Error proxying request to Cisco ${api} API`, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleCandidRequest(request, env) {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace('/api/candid', '');
    const apiQuery = url.search;
    const candidApiUrl = `https://api.candid.org${apiPath}${apiQuery}`;

    const apiKey = env.CANDID_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Candid API key not configured' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const candidResponse = await fetch(candidApiUrl, {
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
                'User-Agent': 'GPW-Platform-Agent/1.0'
            }
        });

        const response = new Response(candidResponse.body, candidResponse);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Ocp-Apim-Subscription-Key');
        return response;
    } catch (error) {
        console.error('Error fetching from Candid API:', error);
        return new Response(JSON.stringify({ message: 'Error proxying request to Candid API', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleUisRequest(request) {
    const url = new URL(request.url);
    // Proxying search requests to UIS API
    const uisApiUrl = `https://api.uis.unesco.org/api/public${url.pathname.replace('/api/uis', '')}${url.search}`;

    try {
        const uisResponse = await fetch(uisApiUrl, {
            headers: {
                'User-Agent': 'GPW-Platform-Agent/1.0'
            }
        });

        const response = new Response(uisResponse.body, uisResponse);

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return response;

    } catch (error) {
        console.error('Error fetching from UIS API:', error);
        return new Response(JSON.stringify({ message: 'Error proxying request to UIS API', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


async function handleIdealistRequest(request, env) {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace('/api/idealist', '');
    const apiQuery = url.search;
    const idealistApiUrl = `https://www.idealist.org/api${apiPath}${apiQuery}`;

    const apiKey = env.IDEALIST_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Idealist API key not configured' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const idealistResponse = await fetch(idealistApiUrl, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Basic ${btoa(`${apiKey}:`)}`
            }
        });

        const response = new Response(idealistResponse.body, idealistResponse);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return response;
    } catch (error) {
        console.error('Error fetching from Idealist API:', error);
        return new Response(JSON.stringify({ message: 'Error proxying request to Idealist API', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleCvaloresRequest(request) {
    const url = new URL(request.url);
    // Proxying requests to cvalores.org API
    const cvaloresApiUrl = `https://cvalores.org/wp-json/wp/v2${url.pathname.replace('/api/cvalores', '')}${url.search}`;

    try {
        const cvaloresResponse = await fetch(cvaloresApiUrl, {
            headers: {
                'User-Agent': 'GPW-Platform-Agent/1.0'
            }
        });

        const response = new Response(cvaloresResponse.body, cvaloresResponse);

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return response;

    } catch (error) {
        console.error('Error fetching from cvalores API:', error);
        return new Response(JSON.stringify({ message: 'Error proxying request to cvalores API', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

async function handleUnepSdgRequest(request) {
    const url = new URL(request.url);
    // Proxying requests to UN SDG API as a source for UNEP-related environmental data
    const sdgApiUrl = `https://unstats.un.org/SDGAPI/v1/sdg${url.pathname.replace('/api/unep/sdg', '')}${url.search}`;

    try {
        const sdgResponse = await fetch(sdgApiUrl, {
            headers: {
                'User-Agent': 'GPW-Platform-Agent/1.0'
            }
        });

        const response = new Response(sdgResponse.body, sdgResponse);

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return response;

    } catch (error) {
        console.error('Error fetching from UN SDG API:', error);
        return new Response(JSON.stringify({ message: 'Error proxying request to UN SDG API', error: error.message }), {
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
    if (path === '/api/status') {
      return await handleStatusRequest(request);
    }
    if (path.startsWith('/api/gbif')) {
        return await handleGbifRequest(request, env);
    }
    if (path.startsWith('/api/candid/')) {
        return await handleCandidRequest(request, env);
    }
    if (path === '/api/google-search') {
        return await handleGoogleSearchRequest(request, env);
    }
    if (path.startsWith('/api/uis/')) {
        return await handleUisRequest(request);
    }
    if (path.startsWith('/api/who/')) {
        return await handleWhoRequest(request);
    }
    if (path.startsWith('/api/cisco/webex/')) {
        return await handleCiscoRequest(request, env, 'webex');
    }
    if (path.startsWith('/api/cisco/meraki/')) {
        return await handleCiscoRequest(request, env, 'meraki');
    }
    if (path.startsWith('/api/idealist/')) {
        return await handleIdealistRequest(request, env);
    }
    if (path.startsWith('/api/cvalores/')) {
        return await handleCvaloresRequest(request);
    }
    if (path.startsWith('/api/unep/sdg/')) {
        return await handleUnepSdgRequest(request);
    }
    if (path.startsWith('/api/oxfam')) {
      return await handleOxfamRequest(request, env);
    }
    if (path === '/api/entrepreneurship') {
      return await handleEntrepreneurshipData(request, env);
    }
    if (path === '/api/users') {
      return await handleUserCreation(request, env);
    } else if (path === '/api/upload') {
        return await handleMediaUpload(request, env);
    } else if (path === '/api/media') {
        return await handleGetMedia(request, env);
    } else if (path === '/api/videos') {
        if (request.method === 'GET') {
            return await handleGetVideos(request, env);
        } else if (request.method === 'POST') {
            return await handleVideoSubmission(request, env);
        }
    } else if (path === '/api/posts') {
        if (request.method === 'GET') {
            return await handleGetPosts(request, env);
        } else if (request.method === 'POST') {
            return await handlePostSubmission(request, env);
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
