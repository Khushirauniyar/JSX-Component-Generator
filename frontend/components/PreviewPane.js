import { useEffect, useRef } from 'react';
import styles from '../styles/PreviewPane.module.css';

export default function PreviewPane({ code, css }) {
  const iframeRef = useRef();

  useEffect(() => {
    const doc = iframeRef.current.contentDocument;
    doc.open();
    doc.write(`
      <html>
        <head>
          <style>
            body { margin: 0; padding: 10px; font-family: Arial; }
            ${css || ''}
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            ${generateRenderScript(code)}
          </script>
        </body>
      </html>
    `);
    doc.close();
  }, [code, css]);

  function generateRenderScript(jsx) {
    let html = '';

    // Case 1: Full component with return()
    const match = jsx.match(/return\s*\(([\s\S]*?)\)/);
    if (match) {
      html = match[1];
    } else {
      // Case 2: Raw JSX (like <button>...</button>)
      html = jsx.trim();
    }

    return `document.getElementById('root').innerHTML = \`${html}\`;`;
  }

  return <iframe ref={iframeRef} className={styles.preview} />;
}
