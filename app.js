const express = require('express');
const line = require('@line/bot-sdk');
const app = express();

// ตัวแปรสะสมยอด
let balance = 0;

// ตั้งค่า LINE Bot
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

// client สำหรับส่งข้อความกลับ
const client = new line.Client(config);

// webhook endpoint
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// ฟังก์ชันจัดการข้อความเข้า
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const message = event.message.text.trim();
  const regex = /^[+-]\d+$/;

  if (regex.test(message)) {
    const amount = parseInt(message, 10);
    balance += amount;

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `ยอดคงเหลือ: ${balance} บาท`
    });
  } else {
    // ไม่ตอบถ้าไม่ใช่คำสั่ง + หรือ -
    return Promise.resolve(null);
  }
}

// เริ่มเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
