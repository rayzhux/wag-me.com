export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, interest, message } = req.body || {};

  // Validate required fields
  if (!name || !email || !interest || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const interestLabels = {
    aftermarket: 'Aftermarket Partnership',
    'data-software': 'Data & Software Solutions',
    insurance: 'Insurance & Claims',
    fintech: 'Fintech & F&I',
    'venture-studio': 'Venture Studio',
    general: 'General Inquiry',
  };

  const slackPayload = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📬 New Contact Form Submission', emoji: true },
      },
      { type: 'divider' },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name:*\n${name}` },
          { type: 'mrkdwn', text: `*Email:*\n${email}` },
          { type: 'mrkdwn', text: `*Company:*\n${company || '_Not provided_'}` },
          { type: 'mrkdwn', text: `*Interest:*\n${interestLabels[interest] || interest}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message:*\n>${message.replace(/\n/g, '\n>')}`,
        },
      },
      { type: 'divider' },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Submitted from worldauto.group at ${new Date().toISOString()}`,
          },
        ],
      },
    ],
  };

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });

    if (!slackRes.ok) {
      console.error('Slack error:', await slackRes.text());
      return res.status(500).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Slack fetch error:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
