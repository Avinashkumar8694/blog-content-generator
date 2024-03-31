const axios = require('axios');
let data = JSON.stringify({
  "model": "gpt-3.5-turbo-16k",
  "stream": true,
  "messages": [
    {
      "role": "assistant",
      "content": "What can you do?"
    }
  ]
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:1337/v1/chat/completions',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
