const accountSid = 'AC3df938872535de40789491bb1dc535f9';
const authToken = '928bfccfe1e2d666ea17e44a4d8012da';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
    body: 'nuevo pedido de (nombre y email del usuario)',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+5493517585871',
  })
  .then((message) => console.log(message.sid));
