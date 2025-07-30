import { useState } from 'react';
import JSZip from 'jszip';
import styles from '../styles/CodeTabs.module.css';

export default function CodeTabs({ code }) {
  const [activeTab, setActiveTab] = useState('jsx');

  const handleCopy = () => {
    const text = activeTab === 'jsx' ? code.jsx : code.css;
    navigator.clipboard.writeText(text);
    alert(`${activeTab.toUpperCase()} code copied!`);
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    zip.file("Component.jsx", code.jsx || '');
    zip.file("Component.css", code.css || '');
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'component-code.zip';
    link.click();
  };

  return (
    <div className={styles.codeTabs}>
      <div className={styles.tabHeader}>
        <button
          onClick={() => setActiveTab('jsx')}
          className={activeTab === 'jsx' ? styles.activeTab : ''}
        >
          JSX
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={activeTab === 'css' ? styles.activeTab : ''}
        >
          CSS
        </button>
      </div>

      <pre className={styles.codeBlock}>
        <code>{activeTab === 'jsx' ? code.jsx : code.css}</code>
      </pre>

      <div className={styles.actions}>
        <button onClick={handleCopy}>Copy</button>
        <button onClick={handleDownload}>Download ZIP</button>
      </div>
    </div>
  );
}
