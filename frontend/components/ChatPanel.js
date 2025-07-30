import { useState } from 'react';
import styles from '../styles/ChatPanel.module.css';

export default function ChatPanel({ onSend, chatHistory = [] }) {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);

  const handleSend = () => {
    if (prompt.trim() || image) {
      onSend(prompt, image);
      setPrompt('');
      setImage(null);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const renderMessage = (msg) => {
    // Detect code block between ``` ```
    const codeMatch = msg.match(/```([\s\S]*?)```/);
    if (codeMatch) {
      const code = codeMatch[1]
        .replace(/^jsx\n/, '')
        .replace(/^javascript\n/, '')
        .replace(/^css\n/, '');
      return (
        <pre className={styles.codeBlock}>
          <code>{code}</code>
        </pre>
      );
    }

    // Preserve line breaks for non-code text
    return <span style={{ whiteSpace: 'pre-wrap' }}>{msg}</span>;
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.history}>
        {chatHistory.map((chat, i) => (
          <div key={i} className={chat.role === 'user' ? styles.userMsg : styles.aiMsg}>
            {renderMessage(chat.message)}
          </div>
        ))}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your component..."
        className={styles.textArea}
      />

      <input
        type="file"
        accept="image/*"
        className={styles.fileInput}
        onChange={handleFile}
      />

      <button className={styles.generateBtn} onClick={handleSend}>Generate</button>
    </div>
  );
}
