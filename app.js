const express = require('express');
const line = require('@line/bot-sdk');
const app = express();
const port = process.env.PORT || 3000;

const config = {
  channelAccessToken: 'm44r1UgeNuG61hJUy25cIEP5NMtczVAzlS4uMOytr4bWiRSU1pmjNCF34KsF0QAQ3ahqTnTjfc3LshDpm4B1jLe6o8CTXy4fLLn+SGqwlRMX+7S+mE6oHXJKQxNAOwm3T0JPfp/NMwnCktdZHiTJ+wdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'e3fb7962d7d7cb495221de6304194edf'
};

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
  const events = req.body.events;

  Promise.all(events.map((event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `You said: ${event.message.text}`
      });
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
