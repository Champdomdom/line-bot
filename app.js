const express = require('express');
const line = require('@line/bot-sdk');
const app = express();
const port = process.env.PORT || 3000;

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

// ตัวแปรสำหรับเก็บยอดคงเหลือ
let balance = 0;

// รับ webhook จาก LINE
app.post('/webhook', line.middleware(config), (req, res) => {
  const events = req.body.events;

  Promise.all(events.map((event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      const message = event.message.text.trim();

      // ตรวจสอบว่าเป็นคำสั่งที่เกี่ยวข้องกับการคำนวณหรือไม่
      if (message.startsWith('+') || message.startsWith('-')) {
        const amount = parseInt(message);

        // ตรวจสอบว่า amount เป็นตัวเลขที่ถูกต้องหรือไม่
        if (!isNaN(amount)) {
          balance += amount;  // คำนวณยอดคงเหลือ

          // ตอบกลับยอดคงเหลือ
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `ยอดคงเหลือ: ${balance} บาท`
          });
        } else {
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: "กรุณาพิมพ์จำนวนเงินที่ถูกต้อง เช่น +100 หรือ -200"
          });
        }
      } else {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: `ยอดคงเหลือปัจจุบัน: ${balance} บาท`
        });
      }
    }
  }))
  .then(() => res.status(200).send('OK'))
  .catch((err) => {
    console.error(err);
    res.status(500).end();
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
