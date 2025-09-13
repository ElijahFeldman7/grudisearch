import { list } from '@vercel/blob';

export default async function handler(req, res) {
  const { blobs } = await list({ prefix: 'tools.json' });
  if (blobs.length === 0) {
    return res.status(404).json({ message: 'Tools data not found.' });
  }

  const toolsUrl = blobs[0].url;
  const response = await fetch(toolsUrl);
  const tools = await response.json();

  res.status(200).json(tools);
}
