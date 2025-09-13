
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { query, classroomTools } = req.body;
  const openAIApiKey = process.env.OPEN_API_KEY;

  if (!openAIApiKey) {
    return res.status(500).json({ message: 'OpenAI API key not configured' });
  }

  const prompt = `Given the user's search for "${query}", find the most relevant items from this list of classroom tools: ${JSON.stringify(classroomTools)}. Your response must be a valid JSON array of arrays, where each inner array contains the tool name and its location. For example: [["Tool Name", "Location"]]. Do not include any text outside of the JSON response. If the object is not found, instruct the user to ask Ms. Grudi`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching from OpenAI:", error);
    res.status(500).json({ message: 'Error fetching from OpenAI' });
  }
}
