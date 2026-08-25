'use client';

import { Search } from 'lucide-react';
import styles from './SearchTrigger.module.css';

export default function SearchTrigger() {
  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('toolock:open-search'));
  };

  return (
    <button
      type="button"
      onClick={openSearch}
      className={styles.trigger}
      aria-label="Search Toolock tools (Ctrl+K)"
    >
      <Search size={16} className={styles.icon} aria-hidden />
      <span className={styles.placeholder}>Search for a tool…</span>
      <div className={styles.shortcuts}>
        <kbd>Ctrl</kbd>
        <kbd>K</kbd>
      </div>
    </button>
  );
}
