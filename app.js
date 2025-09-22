import express from 'express';
import bodyParser from 'body-parser';
import { webhooks } from './services/WebHookServices/WebHookRun.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    await webhooks.receive({
      id: req.headers['x-github-delivery'],
      name: req.headers['x-github-event'],
      payload: req.body
    });
    res.status(200).end();
  } catch (err) {
    console.error('Failed to process webhook:', err);
    res.status(500).end();
  }
});

app.listen(3000, () => console.log('App listening on port 3000'));
