import express from 'express';
import cors from 'cors';
import { config, validateProductionConfig } from './utils/config.js';
import { logger } from './utils/logger.js';
import { verifyGitHubSignature } from './utils/webhook.js';
import { handlePullRequestEvent } from './handle-pr.js';
import { listScans } from './db/memory.js';

if (config.nodeEnv === 'production') validateProductionConfig();

const app = express();
app.use(cors({ origin: config.frontendUrl }));

app.get('/health', (req, res) => {
  res.json({ ok: true, name: 'CodeShield AI backend', time: new Date().toISOString() });
});

app.get('/api/scans', (req, res) => {
  res.json({ scans: listScans() });
});

app.post('/webhooks/github', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = req.header('x-github-event');
    const signature = req.header('x-hub-signature-256');
    const delivery = req.header('x-github-delivery');

    const verified = verifyGitHubSignature({
      rawBody: req.body,
      signatureHeader: signature,
      secret: config.githubWebhookSecret
    });

    if (!verified && !config.allowUnverifiedWebhooks) {
      logger.warn({ event, delivery }, 'Invalid GitHub webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(req.body.toString('utf8'));
    logger.info({ event, delivery, action: payload.action }, 'Webhook received');

    if (event !== 'pull_request') {
      return res.json({ ok: true, ignored: true, reason: `Unsupported event ${event}` });
    }

    res.status(202).json({ ok: true, accepted: true });

    handlePullRequestEvent(payload).catch((error) => {
      logger.error({ err: error }, 'Failed to process pull request event');
    });
  } catch (error) {
    logger.error({ err: error }, 'Webhook handler error');
    if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(config.port, () => {
  logger.info({ port: config.port }, 'CodeShield AI backend running');
});
