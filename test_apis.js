const http = require('http');

const baseUrl = 'http://localhost:5000/api';

async function request(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  try {
    const ts = Date.now();
    console.log('\n--- 1. Register User ---');
    const regRes = await request('/auth/register', 'POST', {
      username: 'testuser_' + ts,
      email: `test${ts}@example.com`,
      password: 'password123'
    });
    console.log('Status:', regRes.status);
    console.log('Response:', JSON.stringify(regRes.body, null, 2));

    console.log('\n--- 2. Login User ---');
    const loginRes = await request('/auth/login', 'POST', {
      email: `test${ts}@example.com`,
      password: 'password123'
    });
    console.log('Status:', loginRes.status);
    console.log('Response:', JSON.stringify(loginRes.body, null, 2));
    
    if (loginRes.status !== 200 || !loginRes.body.data || !loginRes.body.data.token) {
      console.error('Login failed or no token returned.');
      return;
    }
    const token = loginRes.body.data.token;

    console.log('\n--- 3. Create Problem ---');
    const probRes = await request('/problems', 'POST', {
      title: 'Two Sum ' + ts,
      slug: 'two-sum-' + ts,
      difficulty: 'Easy',
      platform: 'LeetCode',
      tags: ['array', 'hash table']
    }, token);
    console.log('Status:', probRes.status);
    console.log('Response:', JSON.stringify(probRes.body, null, 2));
    
    let problemId;
    if (probRes.status === 201 && probRes.body.data) {
      problemId = probRes.body.data.id;
    } else {
      console.log('\nFetching problems to get an existing ID...');
      const listRes = await request('/problems?limit=1', 'GET');
      if (listRes.status === 200 && listRes.body.data && listRes.body.data.length > 0) {
        problemId = listRes.body.data[0].id;
        console.log('Using problem ID:', problemId);
      }
    }

    if (!problemId) {
       console.error('No problem ID available to submit.');
       return;
    }

    console.log('\n--- 4. Submit Problem ---');
    const subRes = await request('/submissions', 'POST', {
      problemId: problemId,
      notes: 'This was an easy one!'
    }, token);
    console.log('Status:', subRes.status);
    console.log('Response:', JSON.stringify(subRes.body, null, 2));

    console.log('\n--- 5. Fetch Leaderboard ---');
    const leadRes = await request('/leaderboard', 'GET');
    console.log('Status:', leadRes.status);
    console.log('Response:', JSON.stringify(leadRes.body, null, 2));
    
  } catch (err) {
    console.error('Error during testing:', err);
  }
}

run();
