import { Webhooks } from '@octokit/webhooks';
import { handlePullRequest } from '../../handler/HandlePullRequest.js';
import { WEBHOOK_SECRET } from '../../config.js';

export const webhooks = new Webhooks({ secret: WEBHOOK_SECRET });

webhooks.on('pull_request', handlePullRequest);

webhooks.onError((error) => {
  console.error('Webhook error:', error);
});
