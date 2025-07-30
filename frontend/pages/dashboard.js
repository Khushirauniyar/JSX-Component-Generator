import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';   
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ChatPanel from '../components/ChatPanel';
import PreviewPane from '../components/PreviewPane';
import CodeTabs from '../components/CodeTabs';
import Navbar from '../components/Navbar';
import styles from '../styles/Dashboard.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [sessionId, setSessionId] = useState(null);
  const [componentCode, setComponentCode] = useState({ jsx: '', css: '' });
  const [chatHistory, setChatHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');   // redirect if not logged in
    }
  }, [token, router]); // ✅ Added router to dependency array

  useEffect(() => {
    if (!sessionId && token) {
      axios.post(`${API_URL}/sessions/create`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setSessionId(res.data._id));
    }
  }, [token, sessionId]);

  const saveSessionState = async (updatedChat, updatedCode) => {
    if (!sessionId) return;
    try {
      await axios.put(`${API_URL}/sessions/update`, 
        {
          sessionId,
          chatHistory: updatedChat || chatHistory,
          componentCode: updatedCode || componentCode
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Auto-save failed:', err.message);
    }
  };

  const handlePrompt = async (prompt, image) => {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('prompt', prompt);
    if (image) formData.append('image', image);
  
    const res = await axios.post(`${API_URL}/sessions/prompt`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const newChat = [...chatHistory, { role: 'user', message: prompt }, { role: 'ai', message: res.data.jsx }];
    setChatHistory(newChat);
    setComponentCode(res.data);
  
    saveSessionState(newChat, res.data);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.dashboard}>
      <Navbar onLogout={handleLogout} />
      <div className={styles.main}>
        <ChatPanel onSend={handlePrompt} chatHistory={chatHistory} />
        <PreviewPane code={componentCode.jsx} css={componentCode.css} />
        <CodeTabs code={componentCode} />
      </div>
    </div>
  );
}
