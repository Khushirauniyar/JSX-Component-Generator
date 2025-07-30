import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Component Generator Platform</h1>
        {user ? (
          <Link href="/dashboard" className={styles.ctaButton}>Go to Dashboard</Link>
        ) : (
          <div className={styles.links}>
            <Link href="/login" className={styles.ctaButton}>Login</Link>
            <Link href="/signup" className={styles.ctaButton}>Signup</Link>
          </div>
        )}
      </div>
    </div>
  );
}
