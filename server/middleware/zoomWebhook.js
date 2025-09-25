const crypto = require('crypto');

const verifyZoomWebhook = (req, res, next) => {
  try {
    // Check if webhook secret is configured
    if (!process.env.ZOOM_WEBHOOK_SECRET) {
      console.warn('⚠️ ZOOM_WEBHOOK_SECRET not configured - webhook verification disabled');
      return res.status(503).json({
        error: 'Zoom webhook integration not configured',
        message: 'ZOOM_WEBHOOK_SECRET environment variable not set'
      });
    }

    const signature = req.headers['authorization'];
    const timestamp = req.headers['x-zm-request-timestamp'];
    const body = JSON.stringify(req.body);

    if (!signature || !timestamp) {
      console.error('Missing Zoom webhook headers');
      return res.status(401).json({ error: 'Missing required headers' });
    }

    // Check timestamp to prevent replay attacks (within 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp);
    if (Math.abs(now - requestTime) > 300) {
      console.error('Zoom webhook timestamp too old');
      return res.status(401).json({ error: 'Request timestamp too old' });
    }

    // Verify signature
    const message = `v0:${timestamp}:${body}`;
    const hashForVerify = crypto
      .createHmac('sha256', process.env.ZOOM_WEBHOOK_SECRET)
      .update(message)
      .digest('hex');

    const expectedSignature = `v0=${hashForVerify}`;

    if (signature !== expectedSignature) {
      console.error('Zoom webhook signature verification failed');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Zoom webhook verified successfully');
    next();

  } catch (error) {
    console.error('Zoom webhook verification error:', error);
    return res.status(500).json({ error: 'Webhook verification failed' });
  }
};

module.exports = verifyZoomWebhook;