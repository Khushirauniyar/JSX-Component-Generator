const axios = require('axios');

module.exports = async function aiGenerator(prompt, imageBase64 = null) {
  try {
    const messages = [
      { role: 'system', content: 'You are a React component generator. Output JSX and CSS separately.' },
      { role: 'user', content: prompt }
    ];

    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: `data:image/png;base64,${imageBase64}` }]
      });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const jsxMatch = content.match(/```jsx([\s\S]*?)```/);
    const cssMatch = content.match(/```css([\s\S]*?)```/);

    return {
      jsx: jsxMatch ? jsxMatch[1].trim() : content,
      css: cssMatch ? cssMatch[1].trim() : ''
    };
  } catch (err) {
    console.error('AI Generation Error:', err.response?.data || err.message);
    return { jsx: `<div>Error generating component</div>`, css: '' };
  }
};
