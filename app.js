const express = require('express');
const { Client } = require('@line/bot-sdk');
const app = express();

// Channel Access Token และ Channel Secret ที่ได้จาก LINE Developers
const config = {
  channelAccessToken: 'm44r1UgeNuG61hJUy25cIEP5NMtczVAzlS4uMOytr4bWiRSU1pmjNCF34KsF0QAQ3ahqTnTjfc3LshDpm4B1jLe6o8CTXy4fLLn+SGqwlRMX+7S+mE6oHXJKQxNAOwm3T0JPfp/NMwnCktdZHiTJ+wdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'e3fb7962d7d7cb495221de6304194edf'
};

const client = new Client(config);

let balance = 0; // ยอดเงินคงเหลือเริ่มต้น

// Webhook ที่รับข้อความจาก LINE
app.post('/webhook', express.json(), (req, res) => {
    const events = req.body.events;
    events.forEach((event) => {
        if (event.type === 'message' && event.message.type === 'text') {
            const message = event.message.text.trim();
            let responseText = '';

            // ตรวจสอบข้อความที่พิมพ์เข้ามา
            const regex = /^([+-]\d+)$/;
            const match = message.match(regex);
            if (match) {
                const amount = parseInt(match[1]);
                balance += amount;  // คำนวณยอดเงิน
                responseText = `ยอดคงเหลือปัจจุบัน: ${balance}`;
            } else {
                responseText = 'กรุณาพิมพ์จำนวนเงินที่ต้องการเพิ่มหรือลบ เช่น +100 หรือ -200';
            }

            client.replyMessage(event.replyToken, {
                type: 'text',
                text: responseText
            });
        }
    });
    res.status(200).send('OK');
});

// ฟังที่ port 3000
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
