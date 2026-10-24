// api/yt-stream.js
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: 'YouTube URL required' });
  }

  try {
    // Cobalt ya Invidious public streaming API instance use karke video link fetch karna
    const apiRes = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        vQuality: '720',
        filenamePattern: 'classic'
      })
    });

    const data = await apiRes.json();

    if (data && data.url) {
      return res.status(200).json({ success: true, streamUrl: data.url });
    } else {
      // Fallback direct stream extractor
      const cleanIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      const videoId = cleanIdMatch ? cleanIdMatch[1] : null;

      if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube Video ID' });
      }

      return res.status(200).json({
        success: true,
        streamUrl: `https://invidious.jing.rocks/latest_version?id=${videoId}&itag=22`
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process YouTube link: ' + err.message });
  }
}