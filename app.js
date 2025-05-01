const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

let balance = 0;

const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const message = event.message.text.trim();
  const regex = /^[+-]\d+$/;

  // ตรวจสอบ + หรือ - ตามด้วยตัวเลข
  if (regex.test(message)) {
    const amount = parseInt(message, 10);
    balance += amount;

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `ยอดคงเหลือ: ${balance} บาท`
    });
  }

  // ตรวจสอบคำถามยอดคงเหลือ
  const keywords = ['ยอด', 'ยอดรวม', 'ยอดคงเหลือ', 'ยอดเท่าไหร่'];
  if (keywords.some(keyword => message.includes(keyword))) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `ยอดคงเหลือตอนนี้: ${balance} บาท`
    });
  }

  // ถ้าไม่เข้าเงื่อนไขใดเลย ไม่ต้องตอบ
  return Promise.resolve(null);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
