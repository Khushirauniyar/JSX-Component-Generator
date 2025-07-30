import styles from '../styles/Navbar.module.css';

export default function Navbar({ onLogout }) {
  return (
    <div className={styles.navbar}>
      <h3>Component Generator</h3>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
