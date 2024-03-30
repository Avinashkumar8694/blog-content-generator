const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config()
const {createCompletion} = require('./generateText');

// Set up the Telegram bot API token
const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

// Create a server object
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

// Set the port number
const port = 3000;

// Handle incoming messages
bot.on('message', async (msg) => {
  // Call the processMessage function to handle the message
  //   console.log(msg);
  processMessage(msg.chat.id, msg);
});

// bot.onText(/(\/\w+)+\//g ,async(msg) =>{
//     console.log(msg);
// })

// Separate function to process a message
async function processMessage(chatId, msg) {
  // console.log('Processing message', chatId, msg);
  // Check if the message is from the desired group
  if (chatId == '502261161') {
    // Log the received message
    console.log(`Received message from ${msg.from.username}: ${msg.text}`);

    // Find links in the message
    const links = findLinks(msg.text);

    // Scrape data from each link
    for (const link of links) {
      try {
        let data;
        if (link.includes('amzn' || 'amazon')) {
          data = await scrapAmazonData(link)
          console.log(data);
        }

        // Do something with the scraped data
        // console.log('Product Info:', data);
      } catch (error) {
        console.error('Error scraping data:', error.message);
      }
    }
  }
}

async function scrapAmazonData(link) {
  console.log(link)
  const response = await axios.get(link);
  const html = response.data;
  const $ = cheerio.load(html);
  const description = await startgpt(`rewrite the description for the blog.${$('#feature-bullets').text()}`)
  // startgpt($('body').text());
  // Extract the desired data from the HTML using Cheerio selectors
  const data = {
    title: $('title').text(),
    brand: $('#bylineInfo_feature_div > div').text(),
    price: $('#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative').text(),
    description: description?.data?.message?.response,
    technical_description: await startgpt(`rewrite the table description for the blog.${$('#productDetails_techSpec_section_1').text()}`)
    // extraInfo: getAmazonIconsAndTextsForAvailableOption(_$)
  }
  return data;
}

const getAmazonIconsAndTextsForAvailableOption = ($) => {
  const iconsAndTexts = [];

  $(".a-row icon-farm-wrapper").each((index, element) => {
    const icon = $(element).find("img").attr("src");
    const text = $(element).find(".icon-content").text();

    iconsAndTexts.push({
      icon,
      text,
    });
  });
  return iconsAndTexts;
};

// function startgpt(html){
//   const child = childProcess.spawn("python3", ["gpt_v3.py", command, args]);
//   child.stdout.on("data", (data) => {
//     console.log(data.toString());
//   })
// }

async function startgpt(data) {
  if(!data) return '';
  // const data = `this is a html content of amazon product page. provide all required data from the provided html content. it may include title price, discount, feature table, delevery option and so on. response should be in json format. \n ${html} `;
  const message = {
    message: data
  };

  const res = await axios.post(`http://api.161-97-91-188.nip.io:8888/generateText`, message)
  return res.data.message;
    // .then(response => {
    //   // Handle the successful response here
    //   // console.log('Response:', response.data);
    //   console.log(response.data);
    //   return response.data;
    // })
    // .catch(error => {
    //   // Handle any errors that occurred during the request
    //   console.error('Error:', error);
    // });
}

async function getProductIdFromLink(link){
let message = `https://www.amazon.in/dp/B089B4V2W7/ref=sspa_dk_detail_2?pd_rd_i=B089B4V2W7&pd_rd_w=ooLs7&content-id=amzn1.sym.dcd65529-2e56-4c74-bf19-15db07b4a1fc&pf_rd_p=dcd65529-2e56-4c74-bf19-15db07b4a1fc&pf_rd_r=VBHNR214F1K9WMWH0269&pd_rd_wg=sFBs4&pd_rd_r=3ade2fb2-2a12-467f-8da9-db42d8eb881d&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfdGhlbWF0aWM&th=1." find id in the provided url string. provide json with id. it should just return json nothing else. ie {"id": "B089B4V2W7"} no other text from you. ie. (no text like: Here is the JSON with the "id" extracted from the provided URL:)`
}

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// Helper function to find links in a text string
function findLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}