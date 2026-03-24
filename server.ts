import express from 'express';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post('/api/send-email', async (req, res) => {
    const { email, name, imageBase64, cardId } = req.body;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'RESEND_API_KEY is not configured in environment variables.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const { data, error } = await resend.emails.send({
        from: 'DLCF Library <onboarding@resend.dev>',
        to: [email],
        subject: `Your DLCF Library Card - ${name}`,
        html: `
          <div style="font-family: sans-serif; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <p>Congratulations! 🎊 You're now an official <strong>DLCF FUTA Library</strong> user! 😊</p>
            <p>Attached is your library card - don't forget to bring it along whenever you visit the library.</p>
            <p>If you have any questions or need help finding resources, we're here to assist you.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #475569;">
              <p>Best Regards,<br><strong>DLCF FUTA LIBRARY/COLPORTEUR UNIT.</strong></p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `library-card-${name.replace(/\s+/g, '-').toLowerCase()}.png`,
            content: imageBase64.split(',')[1], // Remove the data:image/png;base64, prefix
          },
        ],
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error('Email error:', err);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
