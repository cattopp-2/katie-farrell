export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { taskLabel, portal } = req.body;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'cathy@yourwebtoolkit.com',
        subject: `✅ ${portal} — task marked done`,
        html: `
          <p style="font-family: sans-serif; font-size: 15px; color: #333;">
            A task has been marked as done on the <strong>${portal}</strong> portal.
          </p>
          <p style="font-family: sans-serif; font-size: 15px; color: #333;">
            <strong>Task:</strong> ${taskLabel}
          </p>
          <p style="font-family: sans-serif; font-size: 13px; color: #999; margin-top: 24px;">
            <a href="https://katie-farrell.yourwebtoolkit.com" style="color: #1D9ABC;">Open portal →</a>
          </p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
