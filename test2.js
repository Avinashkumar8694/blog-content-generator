const axios = require('axios');

const data = {
  id: "7352422580762332116",
  conversation_id: "a93f7c7c-a0eb-400f-b679-18e935bcab2",
  model: "gpt-3.5-turbo",
  jailbreak: "default",
  web_search: false,
  provider: "You",
  messages: [
    { role: "user", content: "hi" },
    { role: "user", content: "hi" }
  ]
};

axios.post('http://localhost:8080/backend-api/v2/conversation', data, {
  headers: {
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'Connection': 'keep-alive',
    'Cookie': 'code-server-session=%24argon2id%24v%3D19%24m%3D4096%2Ct%3D3%2Cp%3D1%245RfZ9NPWQNMCUJP9eGc2lw%24eLZH%2FOA3a%2FzLds9DrrazRTp990oCjqa6r8ApLCt7QnM',
    'Origin': 'http://localhost:8080',
    'Referer': 'http://localhost:8080/chat/a93f7c7c-a0eb-400f-b679-18e935bcab2',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'accept': 'text/event-stream',
    'content-type': 'application/json',
    'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"'
  }
})
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Error:', error);
});
