const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 3000;

// 1. The Home Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Zen Proxy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { background: #0f0f0f; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .container { background: #1e1e1e; padding: 30px; border-radius: 12px; text-align: center; width: 90%; max-width: 400px; }
          input { padding: 12px; width: 80%; border-radius: 6px; border: none; margin-bottom: 15px; }
          button { padding: 12px 30px; background: #ff4d4d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Zen Proxy</h1>
          <form action="/watch" method="GET">
            <input type="text" name="url" placeholder="Paste YouTube URL..." required />
            <br><button type="submit">Watch</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// 2. The Watch Page
app.get('/watch', async (req, res) => {
  const videoUrl = req.query.url;
  if (!ytdl.validateURL(videoUrl)) return res.status(400).send('Invalid URL');
  try {
    res.send(`
      <!DOCTYPE html>
      <html><body style="background:black;margin:0;display:flex;justify-content:center;align-items:center;height:100vh;">
          <video controls autoplay width="100%" height="100%">
            <source src="/stream?url=${encodeURIComponent(videoUrl)}" type="video/mp4">
          </video>
      </body></html>
    `);
  } catch (error) { res.status(500).send('Error'); }
});

// 3. The Stream
app.get('/stream', (req, res) => {
  const videoUrl = req.query.url;
  res.header('Content-Type', 'video/mp4');
  ytdl(videoUrl, { format: 'mp4', filter: format => format.container === 'mp4' }).pipe(res);
});

app.listen(port, () => console.log(`Proxy running on port ${port}`));
