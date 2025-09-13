import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { tools, password } = req.body;

  if (password !== process.env.EDIT_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { url } = await put('tools.json', JSON.stringify(tools), { access: 'public', allowOverwrite: true });
    res.status(200).json({ message: 'Tools updated successfully', url });
  } catch (error) {
      console.error('Error saving changes:', error);
      return new Response(`Error saving changes: ${error.message}`, { status: 500 });
    }
}
